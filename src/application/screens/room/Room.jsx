import {useRooms, useSessions} from "../../store/useBehaviorSubject";
import moment from "moment/moment";
import {Table} from "antd";

export function Room({ id, onSelectSession, goBack }) {
  const rooms = useRooms();
  const sessions = useSessions()
    .filter(session => session.room === id);
  const room = rooms.find(room => room.id === id);

  if (!room) {
    return <div>
      <a onClick={() => goBack()}> {'<'} Все комнаты</a>
      Комнаты {room.id} не существует
    </div>
  }

  const activeSession = sessions.find(session => !session.finished);
  const lastSession = sessions[0];

  return <div>
    <a onClick={() => goBack()}> {'<'} Все комнаты</a>
    <br />
    Комната: {id}
    <br />
    Пользователей сейчас: {activeSession ? activeSession.peers.length : "Нет"}
    <br />
    Статус: {activeSession ? moment(activeSession.started).format('[Открыта] LT DD.MM.YY') : moment(lastSession.finished).format('[Закрыта] LT DD.MM.YY')}
    <br />
    Журнал сессий:
    <br />
    <Table
      columns={[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: '250px'
        },
        {
          title: 'Начата',
          dataIndex: 'started',
          key: 'started'
        },
        {
          title: 'Окончена',
          dataIndex: 'finished',
          key: 'finished'
        },
        {
          title: 'Всего сообщений в чате',
          dataIndex: 'totalMessages',
          key: 'totalMessages',
          sorter: (r1, r2) => r2.totalMessages - r1.totalMessages,
          width: '250px'
        },
      ]}
      dataSource={sessions.map(session => ({
        id: <a onClick={() => onSelectSession(session.id)}>{session.id.slice(0, 10)}...</a>,
        started: moment(session.started).format("LT DD.MM.YY"),
        finished: session.finished? moment(session.finished).format("LT DD.MM.YY") : 'Нет',
        totalMessages: session.messages.length,
        start: moment(session.started),
        finish: session.finished && moment(session.finished),
      }))}
    />
  </div>
}