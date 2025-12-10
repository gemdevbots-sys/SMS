
export interface SMSRequest {
  phone: string;
  text: string;
  sender_name?: string;
  priority?: number;
  external_id?: string;
}

export interface SMSResponse {
  success: boolean;
  message_id?: string;
  error?: string;
}

// Mock implementation of SMS sending
export const sendSMS = async (request: SMSRequest): Promise<SMSResponse> => {
  console.log('Sending SMS...', request);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          message_id: 'msg_' + Math.random().toString(36).substr(2, 9)
        });
      } else {
        resolve({
          success: false,
          error: 'Gateway timeout or internal error'
        });
      }
    }, 1000);
  });
};
