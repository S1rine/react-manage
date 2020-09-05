import store from 'store'

const USER_KEY = 'user_key'

// const storage = sessionStorage

const saveUser = (user) => {
  // storage.setItem(USER_KEY, JSON.stringify(user))
  store.set(USER_KEY, user)
}
const getUser = () => {
  // return JSON.parse(storage.getItem(USER_KEY))
  return store.get(USER_KEY)
}
const removeUser = () => {
  // storage.removeItem(USER_KEY)
  store.remove(USER_KEY)
}
export {
  saveUser, getUser, removeUser
}