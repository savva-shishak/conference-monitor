import 'antd/dist/antd.css';
import './App.css';
import {useState} from "react";
import {Room} from "./application/screens/room/Room";
import {Session} from "./application/screens/session/Session";
import {Rooms} from "./application/screens/rooms/Rooms";

function App() {
  const [session, setSession] = useState();
  const [room, setRoom] = useState();
  return (
    <div className="App">
      {session ?
        <Session
          id={session}
          onSelectRoom={roomId => {
            setRoom(roomId);
            setSession(null);
          }}
          goToAllRooms={() => { setSession(null); setRoom(null); }}
        />
        :
      room ?
        <Room
          id={room}
          onSelectSession={setSession}
          goBack={() => { setSession(null); setRoom(null); }}
        />
        :
        <Rooms
          onSelectSession={setSession}
          onSelectRoom={setRoom}
        />
      }
    </div>
  );
}

export default App;
