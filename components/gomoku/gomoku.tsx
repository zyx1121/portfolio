'use client'

import { Label } from "@/components/ui/label"
import { useLocalParticipant, useRoomContext } from "@livekit/components-react"
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client"
import { Room } from "livekit-server-sdk"
import { useCallback, useEffect, useRef, useState } from "react"

export default function Gomoku({ name }: { name: string }) {
  const array15 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  const array16 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  const localParticipant = useLocalParticipant().localParticipant
  const roomContext = useRoomContext()

  const [room, setRoom] = useState<Room>()
  const [test, setTest] = useState<number[]>(Array(15 * 15).fill(0))

  const sendTestLock = useRef(false)
  const canSetStone = useRef<boolean>(name === "test" ? true : false)
  const textEncoder = useRef(new TextEncoder())
  const textDecoder = useRef(new TextDecoder())

  const getRooms = async () => {
    try {
      const resp = await fetch(`/api/room?name=test`, { method: 'GET' })
      const data = await resp.json()
      setRoom(data.room)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getRooms()
  }, [])

  useEffect(() => {
    let id = setInterval(() => {
      getRooms()
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const onDataChannel = useCallback(
    (payload: Uint8Array, participant: RemoteParticipant | undefined) => {
      if (!participant) return console.log("no participant");
      const data = JSON.parse(textDecoder.current.decode(payload));
      if (data.channelId === "test") {
        console.log("test received", data.payload)
        sendTestLock.current = true
        canSetStone.current = true
        setTestByTest(data.payload)
      }
    }, []
  );

  const setTestByPosition = useCallback((position: number) => {
    setTest(prevTest => {
      const newTest = [...prevTest]
      newTest[position] = name === "test" ? 1 : 2
      return newTest
    })
    console.log("test set", test)
  }, [test])

  const setTestByTest = useCallback((test: number[]) => {
    setTest(test)
    console.log("test set")
  }, [test])

  const sendTest = useCallback(async () => {
    if (sendTestLock.current) return console.log("test send lock")
    sendTestLock.current = true
    try {
      const payload: Uint8Array = textEncoder.current.encode(
        JSON.stringify({ payload: test, channelId: "test" })
      )
      await localParticipant.publishData(payload, DataPacket_Kind.LOSSY)
      console.log("test send", test)
    } finally {
      sendTestLock.current = false
    }
  }, [localParticipant, test])

  useEffect(() => {
    console.log("test change", test)
    if (room?.numParticipants === 2) sendTest()
    sendTestLock.current = false
  }, [test])

  useEffect(() => {
    console.log("onDataChannel");
    roomContext.on(RoomEvent.DataReceived, onDataChannel)
    return () => {
      roomContext.off(RoomEvent.DataReceived, onDataChannel)
    };
  }, [onDataChannel, roomContext]);

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
      <table className="absolute table-fixed">
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
      <table className="absolute table-fixed m-4">
        <tbody >
          {array15.map((row) => {
            return (
              <tr key={row}>
                {array15.map((col) => {
                  const position = row * 15 + col;
                  switch (test[position]) {
                    case 0:
                      if (canSetStone.current) return (
                        <td key={col} className="h-8 w-8">
                          <div className="w-7 h-7 m-auto rounded-full hover:border" onClick={() => {
                            canSetStone.current = false;
                            setTestByPosition(position);
                          }} />
                        </td>
                      )
                      else return (
                        <td key={col} className="h-8 w-8">
                          <div className="w-4 h-4 m-auto rounded-full hover:border" />
                        </td>
                      )
                    case 1:
                      return (
                        <td key={col} className="h-8 w-8">
                          <div className="w-7 h-7 m-auto rounded-full bg-slate-600" />
                        </td>
                      )
                    case 2:
                      return (
                        <td key={col} className="h-8 w-8">
                          <div className="w-7 h-7 m-auto rounded-full bg-slate-100" />
                        </td>
                      )
                  }
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
