// https://github.com/g-loot/react-tournament-brackets?tab=readme-ov-file#basic-usage

import {
  SingleEliminationBracket,
  Match,
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
  let curr = participants.length / 2;
  let temp = 1;
  for (let i = 0; i < participants.length; i += 2) {
    matches.push(
      round(id, 1, curr + temp, [participants[i], participants[i + 1]])
    );
    if (id % 2 === 0) temp++;
    id++;
  }

  for (let r = 2; r <= Number(Math.log2(participants.length)); r++) {
    curr += participants.length / (1 << r);
    let temp = 1;
    for (let i = 0; i < participants.length; i += 1 << r) {
      matches.push(round(id, r, curr + temp));
      if (id % 2 === 0) temp++;
      id++;
    }
  }
  matches[matches.length - 1].nextMatchId = null;
  return matches;
};

const participants = Array.from({ length: 32 }, (v, i) => ({
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
