import React, { Dispatch, MouseEvent, SetStateAction } from 'react'
import L from 'leaflet'

import {
  CustomPolygonHandlerTypes,
  CustomPolygonTypes,
} from '@/app/types/types'

import { cancelNotConfirming } from '../controls/CancelNotConfirming'
import { cancelWhileDrawingPolygon } from '../controls/CancelWhileDrawingPolygon'
import { confirmPolygon } from '../controls/ConfirmPolygon'
import { finishDrawingPolygon } from '../controls/FinishDrawingPolygon'
import { startDrawing } from '../controls/StartDrawing'

import { Button } from './Button'

type DrawingButtonsProps = {
  polygon: CustomPolygonTypes | null
  hasPolygon: boolean
  isDrawing: boolean
  hasShape: number
  map: L.Map
  isPressed: boolean
  polygonStuff: Element | null
  polygonHandler: CustomPolygonHandlerTypes | null
  setPolygon: Dispatch<SetStateAction<CustomPolygonTypes | null>>
  setIsDrawing: Dispatch<SetStateAction<boolean>>
  setHasPolygon: Dispatch<SetStateAction<boolean>>
  setHasShape: Dispatch<SetStateAction<number>>
}

export const DrawingButtons = ({
  polygon,
  hasPolygon,
  isDrawing,
  hasShape,
  map,
  isPressed,
  polygonStuff,
  polygonHandler,
  setPolygon,
  setIsDrawing,
  setHasPolygon,
  setHasShape,
}: DrawingButtonsProps) => {
  const handleStartDrawing = (e: MouseEvent) =>
    startDrawing(map, setIsDrawing, polygonStuff)(e)

  const handleFinishDrawingPolygon = () => {
    finishDrawingPolygon(map, hasShape, polygonHandler)
  }

  const handleCancelWhileDrawingPolygon = () =>
    cancelWhileDrawingPolygon(map, setIsDrawing, setHasShape, polygonHandler)

  const handlecancelNotComfirming = () => {
    cancelNotConfirming(
      polygon,
      map,
      setPolygon,
      setIsDrawing,
      setHasPolygon,
      setHasShape,
    )
  }

  const handleConfirm = () => {
    confirmPolygon(
      polygon,
      map,
      isPressed,
      setHasShape,
      handlecancelNotComfirming,
    )
  }

  return (
    <div
      className="blobs"
      ref={(ref) => {
        if (!ref) {
          return
        }
        /** import L from "leaflet"; */
        L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref)
      }}
    >
      {!isDrawing ? (
        <Button
          name="Start"
          className="start-button"
          onButtonClick={handleStartDrawing}
        />
      ) : !hasPolygon ? (
        <>
          <Button
            name={
              hasShape < 3 ? `Click at least ${3 - hasShape} points` : 'Finish'
            }
            className="finish-button"
            style={{
              background: hasShape < 3 ? 'grey' : 'rgb(146, 218, 146)',
            }}
            onButtonClick={handleFinishDrawingPolygon}
          />
          <Button
            name="Cancel"
            className="cancel-button"
            onButtonClick={handleCancelWhileDrawingPolygon}
          />
        </>
      ) : (
        <>
          <Button
            name="Confirm"
            className="edit-button"
            onButtonClick={handleConfirm}
          />
          <Button
            name="Cancel"
            className="cancel-button"
            onButtonClick={handlecancelNotComfirming}
          />
        </>
      )}
    </div>
  )
}
