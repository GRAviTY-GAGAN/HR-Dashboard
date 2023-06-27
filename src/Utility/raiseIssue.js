import axios from "axios";

const url =
  process.env.NODE_ENV == "developemnt"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PROD_URL;

export function raiseIssue(data) {
  return axios
    .post(
      `${url}/employee/issues`,
      { issue: data },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export function issueUpdate(id, feedback) {
  return axios
    .patch(`${url}/employee/issues/${id}`, { feedback })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}
