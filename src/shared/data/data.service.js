import axios from "axios";

const API = "http://localhost:80/api/v1/checklists";

const getChecklists = async function() {
  const res = await axios.get(`${API}`);
  console.log(res);
  const checklists = res.data.data.checklists;
  return checklists;
};

const getChecklist = async function(_id) {
  try {
    const res = await axios.get(`${API}/${_id}`);
    // let checklist = parseItem(res, 200);
    const checklist = res.data.data.checklist;
    console.log(checklist);
    return checklist;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const copyChecklist = async function(_id) {
  try {
    const res = await axios.post(`${API}/clone/${_id}`);
    const archived_checklist = res.data.data.checklist;
    console.log(archived_checklist);
    return archived_checklist;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const addDatabaseChecklist = async function(checklist) {
  try {
    const res = await axios.post(`${API}`, checklist);
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateChecklist = async function(checklist) {
  try {
    const res = await axios.patch(`${API}/${checklist._id}`, checklist);
    const updatedChecklist = parseItem(res, 200);
    return updatedChecklist;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteDatabaseChecklist = async function(checklist) {
  try {
    await axios.delete(`${API}/${checklist._id}`);
    return checklist._id;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Function for other constants in dataService
const parseItem = (res, code) => {
  if (res.status !== code) throw Error(res.message);
  let item = res.data;
  if (typeof item !== "object") {
    item = undefined;
    // console.log(res.data)
  }
  return item;
};

export const dataService = {
  getChecklists,
  getChecklist,
  deleteDatabaseChecklist,
  addDatabaseChecklist,
  updateChecklist,
  copyChecklist,
};
