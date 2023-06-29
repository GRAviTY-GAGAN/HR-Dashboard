import "./ResetPass.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, notification, Form, Input } from "antd";

const ResetPass = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const url =
    process.env.NODE_ENV == "development"
      ? process.env.REACT_APP_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  async function resetPassword(value) {
    await axios({
      method: "post",
      url: `${url}/auth/resetPassword/${id}`,
      data: { ...value },
    })
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Password reset successful",
          "Password has been successfully reset, you can now login with your new credentials."
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Password reset unsuccessful",
          "Something went wrong please try again!!"
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
  }

  return (
    <div className="resetPass__mainCont">
      {contextHolder}
      <div className="resetPass__formCont">
        <h1>Reset Password</h1>
        <p>
          Ready to create new password? Please type something you'll remember.
        </p>
        <Form
          layout="vertical"
          onFinish={(values) => {
            resetPassword(values);
          }}
        >
          <Form.Item
            rules={[
              { required: true, message: "Password required." },
              { min: 6 },
            ]}
            name="password"
            label="password"
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            hasFeedback
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm Password required." },
              { min: 6 },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") == value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Password not matching.");
                },
              }),
            ]}
            name="Confirm password"
            label="Confirm password"
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPass;
