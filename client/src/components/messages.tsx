import { useQuery } from "@apollo/client";
import { GET_MESSAGE } from '../queries/Message.query';

interface Message {
  id: string;
  content: string;
}

interface Data {
  messages: Message[];
}

function Messages() {
  const { loading, error, data } = useQuery<Data>(GET_MESSAGE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <>
      {data && data.messages && data.messages.length > 0 ? (
        <div className="row">
          {data.messages.map((message: Message) => (
            <div key={message.id}>
              <div>{message.content }</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Messages</p>
      )}
    </>
  );
}

export default Messages;
