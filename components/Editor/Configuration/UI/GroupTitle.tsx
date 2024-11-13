import React from 'react'

type Props = {
  title: string
}

const GroupTitle: React.FC<Props> = ({ title }) => {
  return <h3 className="my-2 text-sm font-semibold">{title}</h3>
}

export default GroupTitle
