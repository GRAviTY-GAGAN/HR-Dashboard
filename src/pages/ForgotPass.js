import "./ForgotPass.css";
import { Button, notification, Form, Input } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ForgotPass = () => {
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const forgotPassword = async (value) => {
    await axios({
      method: "post",
      url: "http://localhost:5000/auth/forgotPassword",
      data: { ...value },
    })
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Email sent.",
          "Please check your registered email for password reset link."
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        openNotificationWithIcon(
          "error",
          "Password reset unsuccessful",
          "Something went wrong please try again!!"
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
  };

  return (
    <div className="forgotPass__mainCont">
      {contextHolder}
      <div className="forgotPass__formCont">
        <h1>Forgot Password</h1>
        <p>Enter the email that you used for registration.</p>
        <Form
          layout="vertical"
          onFinish={(values) => {
            forgotPassword(values);
          }}
        >
          <Form.Item
            rules={[{ type: "email" }]}
            name="email"
            label="email"
            hasFeedback
          >
            <Input placeholder="email" />
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

export default ForgotPass;
