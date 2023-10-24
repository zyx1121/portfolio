'use client'

import { Label } from "@/components/ui/label";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client";
import { Room } from "livekit-server-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Gomoku({name}: {name: string}) {
  const array15 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const array16 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const [room, setRoom] = useState<Room>();

  let [board, setBoard] = useState<number[]>(Array(15 * 15).fill(0));

  let _receivePosition = useRef<number>(-1);
  let _localPosition = useRef<number>(-1);
  let canSetStone = useRef<boolean>(name === "test" ? true : false);

  const { localParticipant } = useLocalParticipant();
  const roomContext = useRoomContext();
  const positionSendLock = useRef(false);
  const textEncoder = useRef(new TextEncoder());
  const textDecoder = useRef(new TextDecoder());

  const getRooms = async () => {
    try {
      const resp = await fetch(`/api/room?name=test`, { method: 'GET' });
      const data = await resp.json();
      setRoom(data.room);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getRooms();
  }, [])

  useEffect(() => {
    let id = setInterval(() => {
      getRooms();
    }, 3000);
    return () => clearInterval(id);
  }, [])

  const onDataChannel = useCallback(
    (payload: Uint8Array, participant: RemoteParticipant | undefined) => {
      if (!participant) return console.log("no participant");
      const data = JSON.parse(textDecoder.current.decode(payload));
      if (data.channelId === "position") {
        _receivePosition.current = data.payload;
        console.log("receive", _receivePosition.current);
        canSetStone.current = true;
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[Number(_receivePosition.current)] = name === "test" ? 2 : 1;
          return newBoard;
        });
        console.log("board", board);
      }
    }, []
  );

  useEffect(() => {
    console.log("onDataChannel");
    roomContext.on(RoomEvent.DataReceived, onDataChannel);
    return () => {
      roomContext.off(RoomEvent.DataReceived, onDataChannel);
    };
  }, [onDataChannel, roomContext]);

  const sendPosition = useCallback(async () => {
    if (positionSendLock.current) return console.log("position send lock");
    positionSendLock.current = true;
    try {
      const payload: Uint8Array = textEncoder.current.encode(
        JSON.stringify({ payload: _localPosition.current, channelId: "position" })
      );
      await localParticipant.publishData(payload, DataPacket_Kind.LOSSY);
      console.log("send", _localPosition.current);
    } finally {
      positionSendLock.current = false;
    }
  }, [localParticipant]);

  return (
    <main className="w-[100dvw] p-4">
      <div className="grid font-mono">
        <Label>
          room : {room?.name}
        </Label>
        <Label>
          numParticipants : {room?.numParticipants}
        </Label>
        <Label>
          name : {name}
        </Label>
        <Label>
          canSetStone : {canSetStone.current.toString()}
        </Label>
      </div>
      <table className="z-0 absolute">
        <tbody>
          {array16.map((index) => {
            return (
              <tr key={index}>
                {array16.map((index) => {
                  return (
                    <td key={index} className="w-8 h-8 border" />
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <table className="z-0 absolute m-4">
        <tbody >
          {array15.map((row) => {
            return (
              <tr key={row}>
                {array15.map((col) => {
                  const position = row * 15 + col;
                  if (board[position] === 1) return (
                    <td key={col} className="h-8 w-8 text-center">
                      <div className="w-7 h-7 rounded-full bg-slate-600" />
                    </td>
                  )
                  if (board[position] === 2) return (
                    <td key={col} className="h-8 w-8 text-center">
                      <div className="w-7 h-7 rounded-full bg-slate-100" />
                    </td>
                  )
                  if ((board[position] === 0) && (canSetStone.current)) return (
                    <td key={col} className="h-8 w-8 text-center">
                      <div className="w-7 h-7 rounded-full hover:bg-white" onClick={() => {
                        console.log("click", position);
                        canSetStone.current = false;
                        _localPosition.current = position;
                        setBoard(prevBoard => {
                          const newBoard = [...prevBoard];
                          newBoard[position] = name === "test" ? 1 : 2;
                          return newBoard;
                        });
                        console.log("board", board);
                        sendPosition();
                      }} />
                    </td>
                  );
                  else return (
                    <td key={col} className="h-8 w-8 text-center">
                      <div className="w-7 h-7 rounded-full hover:bg-muted" onClick={() => {
                        console.log("click", position);
                      }} />
                    </td>
                  );
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
