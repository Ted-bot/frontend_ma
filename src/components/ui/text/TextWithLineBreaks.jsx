import React from 'react';

const TextWithLineBreaks = ({text}) =>  {
    const textStringify = JSON.stringify(text)
    const finalText = JSON.parse(textStringify)

    const textWithBreaks = finalText.split('\n').map((text, index) => (
        <React.Fragment key={index}>
          {text}
          <br />
        </React.Fragment>
      ));
    
      return <div>{textWithBreaks}</div>;
}

export default TextWithLineBreaks;