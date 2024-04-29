import React from 'react';
import MyModal from './Modal';
import PinkArrow from './PinkArrow';
import {BUTTON_TEXT} from '../constants';

export default function TutorialStep({
  tutorialState,
  pigX,
  pigY,
  nextFunction,
  goBack,
  arrowX,
  arrowY,
}) {
  console.log({pigX, pigY, arrowX, arrowY});
  switch (tutorialState) {
    case 1:
      return (
        <>
          <MyModal
            text={
              'Hello, this is Poopy Pig, you can move him around, click on next for the next instruction'
            }
            modalVisible={true}
            x={10}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow
            x1={10}
            y1={400}
            x2={pigX}
            y2={pigY}
            diffx={150}
            diffy={200}
          />
        </>
      );
    case 2:
      return (
        <>
          <MyModal
            text={`You can Poop on any path by clicking on it ,press "${BUTTON_TEXT.ATTACK}" button after that,\n click next to try this`}
            modalVisible={true}
            x={10}
            y={200}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow x1={10} y1={300} x2={10} y2={400} diffx={10} diffy={-50} />
        </>
      );
    case 3:
      return (
        <>
          <MyModal
            text={`Now Janitors have to clean the poop but they can only cover one path at a time,\n this current farm shows how the janitors are going to move\n click next and then press "${BUTTON_TEXT.AUTO_DEFENDER_MOVE_GUARDS}" to see the poop vanish`}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow x1={10} y1={300} x2={10} y2={300} diffx={60} diffy={-50} />
        </>
      );
    case 4:
      return (
        <>
          <MyModal
            text={
              "There is a path that janitor won't be able to clean(because he can only move one path at a time), click on next and try attacking the same way you attacked before."
            }
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow x1={10} y1={300} x2={10} y2={300} diffx={60} diffy={-50} />
        </>
      );
    case 5:
      return (
        <>
          <MyModal
            text={
              'This is the incorrect move try again . click next , then undo to try'
            }
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow x1={10} y1={300} x2={10} y2={300} diffx={60} diffy={-50} />
        </>
      );
    case 6:
      return (
        <>
          <MyModal
            text={'Janitors have to clean the mess created by the pig'}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 7:
      return (
        <>
          <MyModal
            text={'We have to place janitors on the circles'}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 8:
      return (
        <>
          <MyModal
            text={
              'There should be a janitor on either of the circles of a path so that when the pig poops the janitor cleans it'
            }
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 9:
      return (
        <>
          <MyModal
            text={'Click on any circle to place the janitor'}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 10:
      return (
        <>
          <MyModal
            text={`Very good! now place the remaining janitors such that every path has a janitor on either of the circles and click "${BUTTON_TEXT.GUARDS_PLACEMENT}" to see the pig poop`}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 11:
      return (
        <>
          <MyModal
            text={
              'We have to clean the mess now. Click on the janitor to select it and click on the circle on the other side of the path to command him to go there'
            }
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 12:
      return (
        <>
          <MyModal
            text={`If the janitor goes to clean there, check if any other path is without janitors. Command the other janitor to move if there is such a path. Afterwards, click "${BUTTON_TEXT.MOVE_GUARDS}" to end the turn`}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 13:
      return (
        <>
          <MyModal
            text={
              'If you made a mistake in moving the guard, you can undo the motion by clicking the edge'
            }
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
    case 14:
      return (
        <>
          <MyModal
            text={'Great! Keep playing till the turns finish.'}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
        </>
      );
  }
}
