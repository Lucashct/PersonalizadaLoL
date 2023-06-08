export function balanceTeams(listOfPlayers) {    
    function ratingAllPlayers() {
        let generalRate = 0;
        for(let i = 0; i <= listOfPlayers.length - 1; i++) {
            generalRate += listOfPlayers[i].weight;
        }
    
        return (generalRate / listOfPlayers.length) / 2
    }
    
    function generateAllCombinations(array) {
        const result = [];
        function backTrack(currentCombination, remainingArray) {
            if(currentCombination.length === array.length) {
                result.push(currentCombination);
                return
            }
    
            for(let i = 0; i < remainingArray.length; i++) {
                let newCombination = currentCombination.concat(remainingArray[i]);
                let newRemainingArray = remainingArray.slice(0, i).concat(remainingArray.slice(i + 1));
                backTrack(newCombination, newRemainingArray);
            }
        }
    
        backTrack([], array);
    
        return result;
    }
    
    function calcTeamPowerDifference(team1) {
        let sumTeam1 = 0;
        for(let i = 0; i < team1.length; i++) {
            sumTeam1 += team1[i].weight
        }
    
        const rate = ratingAllPlayers();
    
        const teamDifference = (sumTeam1 / 10) > rate ? (sumTeam1 / 10) - rate : rate - (sumTeam1 / 10);
    
        return teamDifference;
    }
    
    function shuffle() {
        var m = listOfPlayers.length, t, i;
    
        while(m) {
            i = Math.floor(Math.random() * m--);
            t = listOfPlayers[m];
            listOfPlayers[m] = listOfPlayers[i];
            listOfPlayers[i] = t;
        }
    }
    
    function matchMaking() {
        shuffle();
    
        const combinacoes = generateAllCombinations(listOfPlayers);
    
        let teamOne = combinacoes[0].slice(0,5);
        let teamTwo = combinacoes[0].slice(5,10);
    
        while(calcTeamPowerDifference(teamOne) - calcTeamPowerDifference(teamTwo) > 1) {
            for(let i = 0; i < combinacoes.length; i++) {
                const currentTeamOne = combinacoes[i].slice(0,5);
                const currentTeamTwo = combinacoes[i].slice(5,10);
        
                if(calcTeamPowerDifference(teamOne) < calcTeamPowerDifference(currentTeamOne) && calcTeamPowerDifference(teamTwo) < calcTeamPowerDifference(currentTeamTwo)) {
                    teamOne = currentTeamOne;
                    teamTwo = currentTeamTwo;
                }
            }
        }
    
        console.log('Team power time 1:' + calcTeamPowerDifference(teamOne));
        console.log('Team power time 2:' + calcTeamPowerDifference(teamTwo));
        return { teamOne: teamOne, teamTwo: teamTwo }
    }

    const result = matchMaking();

    console.log(result);

    return result;
}