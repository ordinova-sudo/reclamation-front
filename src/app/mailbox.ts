import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

const mailbox$ = new Observable<{ sender: string; message: string }>(subscriber => {
  const messages = [
    { sender: 'Alice', message: 'Salut !' },
    { sender: 'Bob', message: 'Réunion à 14h' },
    { sender: 'Alice', message: 'Tu as vu le doc ?' },
    { sender: 'Charlie', message: 'Urgent : bug sur le site' },
    { sender: 'Alice', message: 'Salut !' },
    { sender: 'Bob', message: 'Réunion à 14h' },
    { sender: 'Alice', message: 'Tu as vu le doc ?' },
    { sender: 'Charlie', message: 'Urgent : bug sur le site' },
    { sender: 'Alice', message: 'Salut !' },
    { sender: 'Bob', message: 'Réunion à 14h' },
    { sender: 'Alice', message: 'Tu as vu le doc ?' },
    { sender: 'Charlie', message: 'Urgent : bug sur le site' },
    { sender: 'Alice', message: 'Salut !' },
    { sender: 'Bob', message: 'Réunion à 14h' },
    { sender: 'Alice', message: 'Tu as vu le doc ?' },
    { sender: 'Charlie', message: 'Urgent : bug sur le site' }
  ];

  let index = 0;
  const intervalId = setInterval(() => {
    if (index < messages.length) {
      subscriber.next(messages[index]);
      index++;
    } else {
      subscriber.complete();
      clearInterval(intervalId);
    }
  }, 1000);
});
export function runMailboxExample() {
return mailbox$.pipe(
  filter(msg => msg.sender === 'Alice'),
  map(msg => ({ ...msg, message: msg.message.toUpperCase() })),
  tap(msg => console.log('Message traité:', msg))
).subscribe({
  next: msg => console.log('Subscriber reçoit:', msg),
  complete: () => console.log('Toutes les notifications ont été reçues')
});
}
