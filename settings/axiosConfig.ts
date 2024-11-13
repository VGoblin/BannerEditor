import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const getAction = async (url: string) => {
  let token = localStorage.getItem('authToken')
  if (!token) throw new Error()

  let config = { headers: { Authorization: 'Bearer ' + token } }

  if (token) return axios.get(`${BASE_URL}${url}`, config)
}

export const postAction = async (url: string, data: any, file = false) => {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error()

  let headers: any = {
    Authorization: `Bearer ${token}`,
  }
  if (file) {
    headers['Content-Type'] = 'multipart/form-data'
  }
  let config = { headers }
  if (token) return axios.post(`${BASE_URL}${url}`, data, config)
}

export const pathcAction = async (url: string, data: any, file = false) => {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error()

  let headers: any = {
    Authorization: `Bearer ${token}`,
  }
  if (file) {
    headers['Content-Type'] = 'multipart/form-data'
  }
  let config = { headers }
  if (token) return axios.patch(`${BASE_URL}${url}`, data, config)
}

export const deleteAction = async (url: string) => {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error()

  let config = { headers: { Authorization: `Bearer ${token}` } }
  if (token) return axios.delete(`${BASE_URL}${url}`, config)
}
