const deepEqual = require('deep-equal');
import specialDeepExtend from './specialDeepExtend';

let testSourceObjects = [
  {
    timelines: [
      {id: "1", text: "1"},
      {id: "2", text: "2", extra: "a"},
      {id: "3", text: "3"}
    ],
    other: "y"
  },
  {
    list: [
      {
        id: "1", 
        data: "a",
        children: [
          {
            id: "2", 
            data: "b",
            extraData: "h",
            children: [
              {
                id: "3",
                data: "c"
              }
            ]
          }
        ]
      },
    ]
  },
  {
    id: "6",
    text: "a",
    choices: [
      {
        id: "1",
        choiceText: "b",
        choices: [
          {
            id: "3",
            choiceText: "d",
            choices: []
          }
        ]
      },
      {
        id: "2",
        choiceText: "c",
        choices: [
          {
            id: "4",
            choiceText: "e",
            choices: []
          }
        ]
      }
    ]
  },
  [
    {
      id: "1", 
      children: [
        {
          id: "2", 
          extraData: "h"
        }
      ]
    }
  ]
];

let testTargetObjects = [
  {
    timelines: [
      {id: "1", text: "1", notes: ["a", "b", "c"]},
      {id: "2", text: "different"},
      {id: "4", text: "4"}
    ],
    other: "x",
    extra: []
  },
  {
    list: [
      {
        id: "1", 
        data: "z",
        children: [
          {
            id: "2", 
            data: "y",
            extraData: "h",
            children: [
              {
                id: "3",
                data: "x"
              }
            ]
          }
        ]
      },
    ]
  },
  {
    id: "6",
    text: "a",
    choices: [
      {
        id: "1",
        choiceText: "bbbb"
      },
      {
        id: "2",
        choiceText: "cccc"
      }
    ]
  },
  [
    {
      id: "1", 
      children: [
        {
          id: "2"
        }
      ]
    }
  ]
];

let testExpectedOutputs = [
  // Explanation of the first expected output: 
  // - object with id 1 has the notes key added to it
  // - object with id 2 is changed
  // - object with id 3 is removed
  // - object with id 4 is added (to the end of the array)
  // - other prop is changed
  // - extra prop is added on
  // - not shown: nested data is also deep extended using specialDeepExtend
  {
    timelines: [
      {id: "1", text: "1", notes: ["a", "b", "c"]},
      {id: "2", text: "different", extra: "a"},
      {id: "4", text: "4"}
    ],
    other: "x",
    extra: []
  },
  {
    list: [
      {
        id: "1", 
        data: "z",
        children: [
          {
            id: "2", 
            data: "y",
            extraData: "h",
            children: [
              {
                id: "3",
                data: "x"
              }
            ]
          }
        ]
      },
    ]
  },
  {
    id: "6",
    text: "a",
    choices: [
      {
        id: "1",
        choiceText: "bbbb",
        choices: [
          {
            id: "3",
            choiceText: "d",
            choices: []
          }
        ]
      },
      {
        id: "2",
        choiceText: "cccc",
        choices: [
          {
            id: "4",
            choiceText: "e",
            choices: []
          }
        ]
      }
    ]
  },
  [
    {
      id: "1", 
      children: [
        {
          id: "2", 
          extraData: "h"
        }
      ]
    }
  ]
];


testSourceObjects.forEach(function (testSourceObject, i) {
  let testTargetObject = testTargetObjects[i];
  let testExpectedOutput = testExpectedOutputs[i]

  let output = specialDeepExtend(testSourceObject, testTargetObject);

  console.log(`test ${i}:`, deepEqual(output, testExpectedOutput) ? "PASSED" : "FAILED");
  console.log(1, JSON.stringify(output));
  console.log(2, JSON.stringify(testExpectedOutput));
});








