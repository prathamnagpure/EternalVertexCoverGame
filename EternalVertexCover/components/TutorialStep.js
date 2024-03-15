import React from 'react';
import MyModal from './Modal';
import PinkArrow from './PinkArrow';

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
              'Now Janitors have to clean the poop but they can only cover one path at max,\n this current farm shows how the janitors are going to move\n click next and then press done to see the shit vanish  '
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
    case 6:
      return (
        <>
          <MyModal
            text={'janitors have to clean the mess created by the pig'}
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
            text={'Click on the circle to place the janitor'}
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow
            x1={10}
            y1={100}
            x2={120}
            y2={30}
            diffx={180}
            diffy={-60}
          />
        </>
      );
    case 10:
      return (
        <>
          <MyModal
            text={
              'Very good! now place the remaining janitors such that every path has a janitor on either of the circles and click done to see the pig poop'
            }
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow
            x1={230}
            y1={100}
            x2={260}
            y2={200}
            diffx={180}
            diffy={0}
          />
          <PinkArrow
            x1={10}
            y1={250}
            x2={120}
            y2={500}
            diffx={180}
            diffy={-60}
          />
        </>
      );
    case 11:
      return (
        <>
          <MyModal
            text={
              'We have to clean the mess now. click on the janitor to select it and click on the circle on the other side of the path to command him to go there'
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
            text={
              'If the janitor will go to clean there the other path will not have a janitor to clean it'
            }
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
              'Command the janitor marked by the pink arrow to go to the other side of the path so that every path has a janitor, after that click done'
            }
            modalVisible={true}
            x={-20}
            y={400}
            onClickNext={nextFunction}
            goBack={goBack}
          />
          <PinkArrow
            x1={230}
            y1={100}
            x2={260}
            y2={200}
            diffx={180}
            diffy={0}
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
