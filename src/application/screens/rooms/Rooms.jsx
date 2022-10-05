import {useRooms, useSessions} from "../../store/useBehaviorSubject";
import {Table} from "antd";
import moment from "moment";
moment.locale('ru');

export function Rooms({ onSelectRoom, onSelectSession }) {
  moment.locale('ru');
  const rooms = useRooms();
  const sessions = useSessions();
  return (
    <div>
      <Table
        columns={[
          {
            title: 'Комната',
            dataIndex: 'id',
            key: 'room'
          },
          {
            title: 'Людей сейчас',
            dataIndex: 'peersCount',
            key: 'peersCount',
            sorter: (r1, r2) => r2.peersCount - r1.peersCount,
          },
          {
            title: 'Активная сессия',
            dataIndex: 'activeSession',
            key: 'activeSession',
          },
          {
            title: 'Последняя сессия',
            dataIndex: 'lastSession',
            key: 'lastSession'
          },
          {
            title: 'Всего сессий',
            dataIndex: 'totalSession',
            key: 'totalSession',
            sorter: (r1, r2) => r2.totalSession - r1.totalSession,
          },
        ]}
        dataSource={
          rooms
            .map(room => {
              const activeSession = sessions.find(session => session.room === room.id && session.open);
              const lastSession = sessions
                .filter(session => session.room === room.id)
                .sort((s1, s2) => moment(s1.finished).isAfter(s2.finished) ? -1 : 1)[0];
              return ({
                id: <a
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectRoom(room.id);
                  }}
                >
                  {room.id}
                </a>,
                key: room.id,
                open: !!activeSession,
                activeSession:
                  activeSession
                    ? (
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectSession(activeSession.id);
                        }}
                      >
                        {moment(activeSession.started).format('[Начата] LT DD.MM.YY')}
                      </a>
                    )
                    : 'Нет',
                lastSession:(
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectSession(lastSession.id);
                    }}
                  >
                    {activeSession
                      ? 'Открыта'
                      : moment(lastSession.finished).format('[Окончена] LT DD.MM.YY')
                    }
                  </a>
                ),
                totalSession: room.sessions.length,
                peersCount: activeSession ? activeSession.peers.length : 0,
              })
            })
      }
      />
    </div>
  );
}