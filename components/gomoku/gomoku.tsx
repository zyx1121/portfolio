'use client'

import { Label } from "@/components/ui/label"
import { useLocalParticipant, useParticipants, useRoomContext } from "@livekit/components-react"
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client"
import { useCallback, useEffect, useRef, useState } from "react"

export default function Gomoku({ name }: { name: string }) {
  const array15 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  const array16 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  const participants = useParticipants()
  const localParticipant = useLocalParticipant().localParticipant
  const roomContext = useRoomContext()

  const [test, setTest] = useState<number[]>(Array(15 * 15).fill(0))

  const preTest = useRef<number[]>(test)
  const sendTestLock = useRef(false)
  const textEncoder = useRef(new TextEncoder())
  const textDecoder = useRef(new TextDecoder())

  const numStones = test.filter((stone) => stone !== 0).length
  const numStonesIsEven = numStones % 2 === 0
  const canSetStone = (numStonesIsEven && name === "test") || (!numStonesIsEven && name !== "test") ? true : false

  const onDataChannel = useCallback(
    (payload: Uint8Array, participant: RemoteParticipant | undefined) => {
      if (!participant) return console.log("no participant");
      const data = JSON.parse(textDecoder.current.decode(payload));
      if (data.channelId === "test") {
        console.log("test received", data.payload)
        sendTestLock.current = true
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
    // if (participants.length < 2) setTest(Array(15 * 15).fill(0))
    if (participants.length === 2) sendTest()
    sendTestLock.current = false
  }, [test])

  useEffect(() => {
    // sendTest()
  })

  useEffect(() => {
    roomContext.on(RoomEvent.DataReceived, onDataChannel)
    return () => {
      roomContext.off(RoomEvent.DataReceived, onDataChannel)
    }
  }, [onDataChannel, roomContext])

  // check win
  useEffect(() => {
    if (test === preTest.current) return;
    const position = test.findIndex((stone, index) => stone !== preTest.current[index])
    console.log("test check", position)
    preTest.current = test

    for (let angle = 0; angle < 4; angle++) {
      let count = 1
      let row = Math.floor(position / 15)
      let col = position % 15
      while (true) {
        switch (angle) {
          case 0:
            row--
            break;
          case 1:
            row--
            col++
            break;
          case 2:
            col++
            break;
          case 3:
            col++
            row++
            break;
        }
        if (row < 0 || row > 14 || col < 0 || col > 14) break;
        if (test[row * 15 + col] !== test[position]) break;
        count++
      }
      row = Math.floor(position / 15)
      col = position % 15
      while (true) {
        switch (angle) {
          case 0:
            row++
            break;
          case 1:
            row++
            col--
            break;
          case 2:
            col--
            break;
          case 3:
            col--
            row--
            break;
        }
        if (row < 0 || row > 14 || col < 0 || col > 14) break;
        if (test[row * 15 + col] !== test[position]) break;
        count++
      }
      if (count >= 5) {
        console.log("test win", test[position])
        setTest(Array(15 * 15).fill(0))
        break;
      }
    }

  }, [test])

  return (
    <main className="w-[100dvw] h-[calc(100dvh-8rem)] p-4 flex items-center justify-center select-none">
      {participants.length < 2 &&
      <div className="fixed z-10 w-[100dvw] h-[calc(100dvh-8rem)] backdrop-blur-sm flex items-center justify-center">
        waiting for opponent...
      </div>
      }
      <div className="fixed z-50 top-20 left-8 grid gap-2 border rounded-lg p-4">
        <Label>
          numParticipants : {participants.length}
        </Label>
        <Label>
          player : {name}
        </Label>
        <Label>
          canSetStone : {canSetStone.toString()}
        </Label>
        <Label>
          numStones : {numStones}
        </Label>
        <Label>
          numStonesIsEven : {(numStones % 2 === 0).toString()}
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
                      if (canSetStone) return (
                        <td key={col} className="h-8 w-8">
                          <div className="w-7 h-7 m-auto rounded-full hover:border" onClick={() => {
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
