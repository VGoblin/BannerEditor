import type { NextPage } from 'next'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import type { CheckboxFormatterProps, SortStatusProps } from 'react-data-grid'
import Head from 'next/head'
import 'react-data-grid/lib/styles.css'
import DataGrid, { SelectColumn, textEditor } from 'react-data-grid'
import { Anchor, Box, Container, Group, LoadingOverlay, Skeleton, Space } from '@mantine/core'
import { Trash } from 'iconsax-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '../../../settings/constants'
import { deleteAction, getAction, postAction } from '../../../settings/axiosConfig'
import Button from '../../../components/UI/Button'
import Header from '../../../components/Editor/Header/Header'

export interface IRow {
  id?: number
  imageUrls?: string
  idx?: number
  data?: string
  projectId?: number
}

export interface ITableData {
  data: {
    columns: string[]
    data: IRow[]
  }
}

export interface IColumn {
  key: string
  name: string
  editable: boolean
  editor: any
  formatter?: any
  width?: number
  resizable?: any
  minWidth?: number
  cellClass?: string
}

const ProjectDataEditor: NextPage = () => {
  const router = useRouter()
  const { projectId } = router.query
  const [rows, setRows] = useState<IRow[]>()
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(() => new Set())
  const [columns, setColumns] = useState<IColumn[]>([])
  const [rowId, setRowId] = useState<number>()
  const queryClient = useQueryClient()
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
      return postAction(`data-editor/${projectId}`, {}) as Promise<{ data: IRow }>
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
    (row: IRow) => {
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

  const { data: generatedRow, isFetching } = useQuery(
    [QueryKeys.getSingleRowRender, projectId, rowId],
    () => {
      return getAction(`data-editor/${projectId}/render/${rowId}`) as Promise<{ data: IRow }>
    },
    {
      enabled: !!rowId,
      onSuccess: (data) => {
        queryClient.invalidateQueries([QueryKeys.getDataEditorTableData, projectId])
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
      width: 80,
      minWidth: 40,
      resizable: false,
    })

    columns.forEach((col, idx) => {
      if (col == 'id' || col === 'imageUrls') return
      newColumns.push({
        key: col,
        name: col,
        minWidth: 80,
        editable: true,
        editor: textEditor,
      })
    })

    newColumns.push({
      key: 'urls',
      name: 'ImageUrls',
      editable: false,
      editor: null,
      formatter({ row }: any) {
        if (!row.imageUrls || !row.imageUrls.length) return null
        return (
          <>
            {row.imageUrls.map((url: string, i: number) => (
              <Anchor mr={4} key={url} href={url} target="_blank">
                Link {i + 1}
              </Anchor>
            ))}
          </>
        )
      },
    })

    newColumns.push({
      key: 'render',
      name: 'Actions',
      width: 140,
      minWidth: 80,
      cellClass: 'outline-none',
      editable: false,
      editor: undefined,

      formatter({ row }: any) {
        return (
          <div className="mt-[6px] flex justify-around gap-2">
            <Button
              className="text-xs"
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
      <Box sx={{ minHeight: 'calc(100vh - 30px)', paddingTop: 30, backgroundColor: '#eee' }}>
        <Container mb={30} size={1368}>
          {tableData && columns && columns.length && rows ? (
            <>
              <Group position="apart">
                <Button light onClick={() => addRowMutation.mutate()} className="flex-0 mt-2fkex">
                  Add Row
                </Button>
                <Button onClick={() => addRowMutation.mutate()} className="flex-0 mt-2fkex">
                  Render All
                </Button>
              </Group>
              <Space h={16} />
              <DataGrid
                className="fill-grid rdg-light border-l border-r shadow"
                columns={columns}
                rows={rows}
                rowHeight={40}
                enableVirtualization={false}
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
            </>
          ) : (
            <>
              <Skeleton height={40} mt={1} />
              <Skeleton height={40} mt={1} />
              <Skeleton height={40} mt={1} />
            </>
          )}
          {/* <LoadingOverlay visible={isFetching} overlayBlur={2} /> */}
        </Container>
      </Box>
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
function rowKeyGetter(row: IRow) {
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

export default ProjectDataEditor
