import axios from 'axios';

const useAxios = (list, path) => {

// Dev
// const api = `//localhost:3001/api/v1/${path}`

// Server
const api = `/api/v1/${path}`

  const getItems = async (callback) => {
    let items = await axios.get(api);
    callback(items.data.map( row => {row._mode = "view"; return row;}))
  };

  const getItemById = async (id, callback) => {
    let item = await axios.get(`${api}/${id}`);
    callback(item.data)
  };

  const addNewItem = async (id, item, callback) => {
    let newItem = await axios.post(api, item);
    callback(
        list.map((listItem) => (listItem._id === id ? {...newItem.data, _edit: {}, _mode: "view"} : listItem))
      );
  }

  const updateItem = async(id, callback) => {
    try {
      let item = list.filter((i) => i._id === id)[0] || {};
      if (item._id) {
        let updatedItem = await axios.put(`${api}/${id}`, item._edit);
        let data = updatedItem.data;
        data._edit = {};
        data._mode = "view";
        callback(
          list.map((listItem) => (listItem._id === id ? data : listItem))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  const deleteItem = async (id, callback) => {
    try {
      await axios.delete(`${api}/${id}`);
      callback(list.filter((el) => el._id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  return [getItems, addNewItem, updateItem, deleteItem, getItemById]
}

export default useAxios;