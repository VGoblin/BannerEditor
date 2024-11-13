import type { NextPage } from 'next'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import type { Column, CheckboxFormatterProps, SortColumn, SortStatusProps } from 'react-data-grid'
import Head from 'next/head'
import 'react-data-grid/lib/styles.css'
import DataGrid, { SelectColumn, textEditor } from 'react-data-grid'
import Button from '../../components/UI/Button'
import { Skeleton } from '@mantine/core'
import { Trash } from 'iconsax-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../settings/constants'
import { deleteAction, getAction, postAction } from '../../settings/axiosConfig'
import Header from '../../components/Editor/Header/Header'
// !!! SİLİNECEK
interface Row {
  id?: number
  imageUrls?: string
  idx?: number
  data?: string
  projectId?: number
}

interface ITableData {
  data: {
    columns: string[]
    data: Row[]
  }
}

interface IColumn {
  key: string
  name: string
  editable: boolean
  editor: any
  formatter?: any
  width?: number
  resizable?: any
  minWidth?: number
}

const DataEditorWrapper: NextPage = () => {
  const router = useRouter()
  const { projectId } = router.query
  const [rows, setRows] = useState<Row[]>()
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(() => new Set())
  const [columns, setColumns] = useState<IColumn[]>([])
  const [rowId, setRowId] = useState<number>()

  // Get Table Data
  const { data: tableData } = useQuery(
    [QueryKeys.getDataEditorTableData, projectId],
    () => {
      return getAction(`data-editor/${projectId}`) as Promise<ITableData>
    },
    {
      enabled: !!projectId,
      onSuccess: (data) => {
        setRows((prevVal) => {
          return data.data.data.map((row, index) => {
            return {
              ...row,
              idx: ++index,
            }
          })
        })
        generateColumns(data.data.columns)
      },
    }
  )

  const addRowMutation = useMutation(
    () => {
      return postAction(`data-editor/${projectId}`, {}) as Promise<{ data: Row }>
    },
    {
      onSuccess(res) {
        // @ts-ignore
        setRows((prev: Row[]) => {
          return [...prev, { ...res.data, idx: prev.length + 1 }]
        })
      },
    }
  )

  const updateRowMutation = useMutation(
    (row: Row) => {
      const reqData = { ...row }
      delete reqData.id
      delete reqData.idx
      delete reqData.imageUrls
      delete reqData.data
      delete reqData.projectId
      return postAction(`data-editor/${projectId}/update/${row.id}`, reqData)
    },
    {
      onSuccess(res) {},
    }
  )

  const deleteRowMutation = useMutation(
    (id: number) => {
      return deleteAction(`data-editor/${projectId}/delete/${id}`)
    },
    {
      onSuccess(res, variables) {
        // @ts-ignore
        setRows((prev: Row[]) => {
          return prev.filter((row) => row.id !== variables)
        })
      },
    }
  )

  const { data: generatedRow } = useQuery(
    [QueryKeys.getSingleRowRender, projectId, rowId],
    () => {
      return getAction(`data-editor/${projectId}/render/${rowId}`) as Promise<{ data: Row }>
    },
    {
      enabled: !!rowId,
      onSuccess: (data) => {
        setRowId(undefined)
      },
    }
  )

  const generateColumns = (columns: string[]) => {
    let newColumns: IColumn[] = []
    // @ts-ignore
    newColumns.push({
      ...SelectColumn,
      // headerCellClass: 'text-red-500',
      // cellClass: 'text-red-500',
    })
    newColumns.push({
      key: 'idx',
      name: 'No',
      editable: false,
      editor: null,
      width: 40,
      minWidth: 40,
      resizable: false,
    })

    columns.forEach((col, idx) => {
      if (col == 'id') return
      newColumns.push({
        key: col,
        name: col,
        editable: col !== 'imageUrls',
        editor: col !== 'imageUrls' ? textEditor : undefined,
      })
    })

    newColumns.push({
      key: 'render',
      name: 'Actions',
      width: 140,
      minWidth: 40,
      editable: false,
      editor: undefined,

      formatter({ row }: any) {
        return (
          <div className="mt-[6px] flex justify-around gap-2">
            <Button
              className="text-xs"
              ghost
              compact
              onClick={() => {
                setRowId(row.id)
              }}
            >
              Render
            </Button>

            <span
              className="flex cursor-pointer items-center"
              onClick={() => deleteRowMutation.mutate(row.id)}
            >
              <Trash
                size="18"
                className="text-red-400 transition-all duration-150 hover:!text-red-600"
              />
            </span>
          </div>
        )
      },
    })
    setColumns(newColumns)
  }

  return (
    <>
      <Head>
        <title>Bannerfans | Data Editor</title>
      </Head>
      <Header />
      {tableData && columns && columns.length && rows ? (
        <DataGrid
          className="fill-grid rdg-light"
          columns={columns}
          rows={rows}
          rowHeight={40}
          rowKeyGetter={rowKeyGetter}
          // onRowsChange={setRows}
          defaultColumnOptions={{
            resizable: true,
          }}
          // sortColumns={sortColumns}
          // onSortColumnsChange={setSortColumns}
          // rowClass={(row) => 'grid-row text-red-500'}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          renderers={{ sortStatus, checkboxFormatter }}
          onRowsChange={(rows, row) => {
            setRows(rows)

            updateRowMutation.mutate(rows[row.indexes[0]])
          }}
        />
      ) : (
        <>
          <Skeleton height={40} mt={1} />
          <Skeleton height={40} mt={1} />
          <Skeleton height={40} mt={1} />
        </>
      )}

      <Button onClick={() => addRowMutation.mutate()} className="mt-2">
        Add Row
      </Button>
    </>
  )
}

function checkboxFormatter(
  { disabled, onChange, ...props }: CheckboxFormatterProps,
  ref: React.RefObject<HTMLInputElement>
) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey)
  }

  return <input type="checkbox" ref={ref} {...props} onChange={handleChange} />
}

function sortStatus({ sortDirection, priority }: SortStatusProps) {
  return (
    <>
      {sortDirection !== undefined ? (sortDirection === 'ASC' ? '\u2B9D' : '\u2B9F') : null}
      <span className={''}>{priority}</span>
    </>
  )
}
function rowKeyGetter(row: Row) {
  return row.id!
}

// type Comparator = (a: Row, b: Row) => number
// function getComparator(sortColumn: string): Comparator {
//   switch (sortColumn) {
//     case 'id':
//       return (a, b) => a.id - b.id
//     default:
//       throw new Error(`unsupported sortColumn: "${sortColumn}"`)
//   }
// }

export default DataEditorWrapper
