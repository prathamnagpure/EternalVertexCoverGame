import React from 'react';
import {View} from 'react-native';
import MyModal from './Modal';
import PinkArrow from './PinkArrow';

export default function TutorialStep({
  tutorialState,
  pigX,
  pigY,
  nextFunction,
  goBack,
}) {
  console.log({pigX, pigY});
  switch (tutorialState) {
    case 1:
      return (
        <>
          <MyModal
            text={
              'Hello , this is poopy pig ,you can move this around click on next for next instruction'
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
            text={
              'You can Poop on any path by clicking it , then pressing done ,\n click next to try this'
            }
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
            text={
              'Now Janitors have to clean this shit but they can only cover one path at max,\n this current farm shows how the janitors are going to move\n click next and then press done to see the shit vanish  '
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
    case 4:
      return (
        <>
          <MyModal
            text={
              'There is a edge that janitor wont be able to clean(because he can only move one path at max) , click on next and try attacking the same way you attacked before.'
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
  }
}
