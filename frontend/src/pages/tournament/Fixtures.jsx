// https://github.com/g-loot/react-tournament-brackets?tab=readme-ov-file#basic-usage

import {
  SingleEliminationBracket,
  Match,
  SVGViewer
} from "@g-loot/react-tournament-brackets";

const round = (
  id,
  tournamentRoundText,
  nextMatchId = null,
  participant = [],
  startTime = "",
  state = "SCHEDULED"
) => {
  return {
    id,
    tournamentRoundText,
    nextMatchId,
    startTime: startTime,
    state,
    participants: participant,
  };
};

const generate = (participants) => {
  const matches = [];
  let id = 1;
  let temp = 1;
  const highPow = 2**Math.ceil(Math.log2(participants.length));
  const lowPow = 2**Math.floor(Math.log2(participants.length));
  console.log(highPow);
  const bye = participants.length - lowPow
  let curr = 0;
  console.log(curr);
  let x = 0;
  if(bye > 0) {
    curr += highPow/2;
    for(let i=0; i<highPow/2; i++) {
      matches.push(round(id, 0, curr+temp, [x < 2*bye ? participants[x++] : {
        id: Math.floor(Math.random()*1000),
        name: "NA"
      }, x < 2*bye ? participants[x++] : {
        id: Math.floor(Math.random()*1000),
        name: "NA"
      }]));
      if(id%2 === 0) temp++;
      id++;
    } 
  }
  curr += lowPow/2;
  temp = 1;
  for (let i = 0; i < lowPow; i += 2) {
    matches.push(
      round(id, 1, curr + temp, [i < bye ? {
        id: Math.floor(Math.random()*1000),
        name: "TBD"
      } : participants[x++], i+1 < bye ? {
        id: Math.floor(Math.random()*1000),
        name: "TBD"
      } : participants[x++]])
    );
    if (id % 2 === 0) temp++;
    id++;
  }

  for (let r = 2; r <= Number(Math.log2(lowPow)); r++) {
    curr += lowPow / (1 << r);
    let temp = 1;
    for (let i = 0; i < lowPow; i += 1 << r) {
      matches.push(round(id, r, curr + temp));
      if (id % 2 === 0) temp++;
      id++;
    }
  }
  matches[matches.length - 1].nextMatchId = null;
  console.log(matches)
  return matches;
};

const participants = Array.from({ length: 63 }, (v, i) => ({
  id: `p${i + 1}`,
  name: `Participant ${i + 1}`,
}));

const matches = generate(participants);

function Fixtures() {
  return (
    <div className="overflow-x-auto p-4 rounded-lg">
      <div className="inline-block min-w-max">
        <SingleEliminationBracket
          matches={matches}
          matchComponent={Match}    
        />
      </div>
    </div>
  );
}

export default Fixtures;
