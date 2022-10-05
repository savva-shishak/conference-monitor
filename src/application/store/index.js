import {BehaviorSubject} from "rxjs";
import { io } from 'socket.io-client';
import axios from "axios";

const socket = io('wss://api.wee-bee.ru', {});

function connectRepo(modelName) {
  const store = new BehaviorSubject([]);

  socket.on('repo.created-' + modelName, model => {
    if (store.getValue().every(item => item.id !== model.id)) {
      store.next([...store.getValue(), model]);
    }
  });

  socket.on('repo.updated-' + modelName, model => {
    store.next(store.getValue().map(item => item.id === model.id ? model : item));
  });

  socket.on('repo.removed-' + modelName, model => {
    store.next(store.getValue().filter(item => item.id !== model.id));
  });

  return store;
}

export const rooms = connectRepo('room');
export const sessions = connectRepo('session');
export const peers = connectRepo('peer');

axios.post('https://api.wee-bee.ru/admin/get-all').then(({ data }) => {
  rooms.next(data.rooms);
  sessions.next(data.sessions);
  peers.next(data.peers);
})