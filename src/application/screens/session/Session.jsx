import {usePeers, useSessions} from "../../store/useBehaviorSubject";
import {Table, Tabs} from "antd";

function downloadFile(file) {
  fetch(file.url).then(async (res) => {
    const a = document.createElement('a');

    a.href = URL.createObjectURL(await res.blob());
    a.target = '_blank';
    a.style.display = 'none';
    a.download = file.name;

    document.body.append(a);
    a.click();
  });
}

export function Session({ id, onSelectRoom, goToAllRooms }) {
  const session = useSessions().find(session => session.id === id);
  const allPeers = usePeers();
  if (!session) {
    return (
      <div>
        <a onClick={() => goToAllRooms()}> {'<'} Все комнаты</a>
        Сессии с ID {id} не существует
      </div>
    );
  }

  const peers = allPeers.filter(peer => session.peers.includes(peer.id))

  return <div>
    <a onClick={() => goToAllRooms()}> {'<'} Все комнаты</a>
    <br />
    ID сессии: {session.id}
    <br/>
    Комната: <a onClick={() => onSelectRoom(session.room)}>{session.room}</a>
    <Tabs
      items={[
        {
          label: 'Участники',
          key: 'employees',
          children: (
            <Table
              columns={[
                {
                  title: 'Имя',
                  dataIndex: 'displayName',
                  key: 'name',
                },
                {
                  title: 'Рука поднята/опущена',
                  dataIndex: 'waving',
                  key: 'waving',
                },
                {
                  title: 'Отправил сообщений',
                  dataIndex: 'totalMessages',
                  key: 'totalMessages',
                }
              ]}
              dataSource={peers.map(peer => ({
                displayName: peer.displayName,
                waving: session.wavings.includes(peer.id) ? 'Поднята' : 'Опущена',
                totalMessages: session.messages.filter(msg => msg.author.peerId === peer.id).length
              }))}
            />
          )
        },
        {
          label: 'Сообщения',
          key: 'messages',
          children: (
            <Table
              columns={[
                {
                  title: 'Автор',
                  dataIndex: 'author',
                  key: 'author',
                  width: '200px'
                },
                {
                  title: 'Текст',
                  dataIndex: 'text',
                  key: 'text'
                },
                {
                  title: 'Файлы',
                  dataIndex: 'totalFiles',
                  key: 'totalFiles',
                  width: '200px'
                },
              ]}
              dataSource={session.messages.map(msg => ({
                author: msg.author.displayName,
                text: msg.text,
                totalFiles: msg.files.length
                  ? <a onClick={() => msg.files.forEach(downloadFile)} >Скачать ({msg.files.length})</a>
                  : "Нет",
              }))}
            />
          )
        },
      ]}
    />
  </div>
}