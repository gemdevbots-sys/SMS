import axios from 'axios';

const SMS_API_URL = 'http://api.sms-prosto.ru/';
const API_KEY = process.env.SMS_API_KEY;

interface SmsResponse {
  msg: {
    err_code: string;
    text: string;
    type: string;
  };
  data?: any;
}

export const sendSms = async (phone: string, text: string, senderName?: string, externalId?: string) => {
  if (!API_KEY) {
    throw new Error('SMS_API_KEY not configured');
  }

  const params: any = {
    method: 'push_msg',
    format: 'json',
    key: API_KEY,
    phone,
    text,
  };

  if (senderName) {
    params.sender_name = senderName;
  }

  try {
    const response = await axios.get<SmsResponse>(SMS_API_URL, { params });
    if (response.data.msg.err_code !== "0") {
        console.error('SMS API Error:', response.data);
        return { success: false, error: response.data.msg.text, apiResponse: JSON.stringify(response.data) };
    }

    const msgId = response.data.data ? response.data.data.id : null;
    return { success: true, externalId: msgId, apiResponse: JSON.stringify(response.data) };

  } catch (error: any) {
    console.error('SMS Send Error:', error.message);
    return { success: false, error: error.message, apiResponse: error.response ? JSON.stringify(error.response.data) : null };
  }
};

export const checkStatus = async (id: string) => {
    if (!API_KEY) throw new Error('SMS_API_KEY not configured');

    const params = {
        method: 'get_msg_report',
        format: 'json',
        key: API_KEY,
        id
    };

    try {
        const response = await axios.get<SmsResponse>(SMS_API_URL, { params });
        if (response.data.msg.err_code !== "0") {
             return { success: false, error: response.data.msg.text };
        }
        return { success: true, data: response.data.data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
