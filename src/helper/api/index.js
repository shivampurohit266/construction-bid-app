import axios from 'axios';

export const getData = (url, token) => {
  return axios
    .get(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    .then((response) => {
      return response;
    })  
    .catch((err) => {
      return console.log(err);
    });
};

export const postData = (url, data) => {
  return axios
    .post(`${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      return console.log(err);
    });
};

export const postDataWithToken = (url, data, token) => {
  return axios
    .post(`${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept": "application/json"
      },
    })
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export const modifyData = (url, data) => {
  return axios
    .put(`${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      return console.log(err);
    });
};
export const modifyDataWithTokenAndParams = (url, data, token) => {
  return axios
    .put(`${url}`, null, {
      params: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      return console.log(err);
    });
};
export const modifyDataWithToken = (url, data, token) => {
  return axios
    .put(`${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      return console.log(err);
    });
};
export const deleteData = (url, token) => {
  return axios
    .delete(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return console.log(err);
    });
};
