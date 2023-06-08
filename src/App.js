import { useState } from 'react';
import './App.css';
import { REQUEST_RANK_SUMMONER, REQUEST_SUMMONER } from "./urls"
import axios from 'axios';
import { weights } from './consts';
import { balanceTeams } from './util';


function App() {
  const [ searchPlayer, setSearchPlayer ] = useState({});
  const [ summoner, setSummoner ] = useState({});
  const [ listOfPlayers, setListOfPlayers ] = useState([]);
  const [ firstTeam, setFirstTeam ] = useState([]);
  const [ seccondTeam, setSeccondTeam ] = useState([]);

  function removePlayer(id) {
    const newList = listOfPlayers.filter((item) => item.encryptedId !== id);

    setListOfPlayers(newList);
  }

  function sortTeams(listOfPlayers) {
    if(listOfPlayers.length < 10) {
      alert('É necessário 10 players para sortear');
      return;
    }

    const teamsSorted = balanceTeams(listOfPlayers);

    const listTeamOne = [...teamsSorted.teamOne];
    const listTeamTwo = [...teamsSorted.teamTwo];

    setFirstTeam(listTeamOne);
    setSeccondTeam(listTeamTwo);
    
    console.log(teamsSorted.teamOne);
    console.log(teamsSorted.teamTwo);
  }

  function addPlayer(player) {
    if(listOfPlayers.length === 10) {
      alert('10 jogadores no máximo mlk.');
      return;
    }

    const playerToList = {
      encryptedId: player.encryptedId,
      nickName: player.nickName,
      profileIconId: player.profileIconId,
      elo: player.weightDuo > player.weightFlex ? player.eloDuo : player.eloFlex,
      weight: player.weightDuo > player.weightFlex ? player.weightDuo : player.weightFlex
    }

    const listUpdated = [...listOfPlayers, playerToList];
    setListOfPlayers(listUpdated);

    setSummoner({})
  }

  function filterRanks(ranksArray) {
    const ranksObject = {}

    ranksArray.forEach(element => {
      if(element.queueType === 'RANKED_FLEX_SR') {
        ranksObject.eloFlex = `${element.tier}_${element.rank}`
      } else if(element.queueType === 'RANKED_SOLO_5x5') {
        ranksObject.eloDuo = `${element.tier}_${element.rank}`
      }
    });

    return ranksObject;
  }

  function atributeWeights(tier) {
    for(let i = 0; i < weights.length; i ++) {
      if(tier === weights[i].rank) {
        return weights[i].weight;
      }
    } 
  }
  
  async function getSummoner(nickName) {
    try {
      const summonerResponse = await axios.get(REQUEST_SUMMONER + `${nickName}?api_key=` + process.env.REACT_APP_API_RIOT_KEY);
      const rankResponse = await axios.get(REQUEST_RANK_SUMMONER + `${summonerResponse.data.id}?api_key=` + process.env.REACT_APP_API_RIOT_KEY)
      
      if(rankResponse.data.length < 1) {
        alert('Ranks da conta não foram encontrados');
        return;
      } 

      const ranksArray = filterRanks(rankResponse.data);
  
      const constructedSummuner = {
        encryptedId: summonerResponse.data.id,
        nickName: summonerResponse.data.name,
        profileIconId: summonerResponse.data.profileIconId,
        eloFlex: ranksArray.eloFlex,
        eloDuo: ranksArray.eloDuo,
        weightDuo: atributeWeights(ranksArray.eloDuo),
        weightFlex: atributeWeights(ranksArray.eloFlex)
      }
  
      setSummoner(constructedSummuner);
    } catch (ex) {
      alert('Usuário não encontrado') 
    }
  }

  return (
    <div className='App'>
      <div className='main-container'>
        <div className='lat-menu'>
          
          <div className='add-player-container'>
            <input onChange={e => setSearchPlayer(e.target.value)} name="nickname" placeholder='Nickname' style={{ height:'20px', width: '200px', borderRadius: '15px', border: '0px', marginRight: '10px', padding: '5px'}}></input>
            <button onClick={() => getSummoner(searchPlayer)} style={{ background: '#82e1e1', borderRadius: '50%', height: '30px' }}>🔍</button>
          </div>
          {
            !summoner.encryptedId ? <div className='player-container'/> :
            <div className='player-container'>
              <img alt='icon-player' className='icon-image' src={`http://ddragon.leagueoflegends.com/cdn/13.11.1/img/profileicon/${summoner.profileIconId}.png`}></img>
              <div className='infos-player'>
                <span>{summoner.nickName}</span>
                <span style={{fontSize:'10px'}}>{summoner.weightDuo > summoner.weightFlex ? summoner.eloDuo.replace('_', ' ') :
                summoner.eloFlex.replace('_', ' ')}</span>
              </div>
              <button onClick={() => addPlayer(summoner)} style={{ 
                background: '#82e1e1', 
                borderRadius: '50%', 
                height: '30px',
                width: '32px',
                margin: '3px 0px 0px 15px' 
              }}>+</button>
            </div>
          }
          <div className='list-of-players'>
            <ul className='ul-list'>
              {listOfPlayers.map(item => {
                return(
                  <li key={item.encryptedId}>
                    <div className='player-container-list'>
                      <img alt='icon-player-list' className='icon-image-list' src={`http://ddragon.leagueoflegends.com/cdn/13.11.1/img/profileicon/${item.profileIconId}.png`}></img>
                      <div className='infos-player-list'>
                        <span style={{fontSize:'13px'}}>{item.nickName}</span>
                        <span style={{fontSize:'8px'}} className='elo'> {item.elo.replace('_', ' ')} </span>
                      </div>
                      <button className='buttonRemove' onClick={() => removePlayer(item.encryptedId)}>🗑</button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <span style={{ color:'whiteSmoke', marginLeft:'10%', fontSize: '10px' }}>{`${listOfPlayers.length} ${listOfPlayers.length === 1 ? 'jogador' : 'jogadores'}
          ${listOfPlayers.length === 1 ? 'adicionado' : 'adicionados'}`}</span>
        </div>
        <div style={{ display: 'flex', flexDirection:'column', textAlign:'center' }}>
          <h1>Personalizada Feijuca</h1>
          <div className='result-sort'>
            <div className='first-team'>
              <label>Time 1</label>

              <ul>
                {firstTeam.map(item => {
                  return(
                    <li key={item.encryptedId}>
                      <div className='player-container-list'>
                        <img alt='icon-player-list' className='icon-image-list' src={`http://ddragon.leagueoflegends.com/cdn/13.11.1/img/profileicon/${item.profileIconId}.png`}></img>
                        <div className='infos-player-list'>
                          <span>{item.nickName}</span>
                          <span style={{fontSize:'10px'}} className='elo'> {item.elo.replace('_', ' ')} </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <button onClick={() => sortTeams(listOfPlayers)} style={{ height: '50px', marginTop: '25%' }}>Sortear</button>
            
            <div className='seccond-team'>
              <label>Time 2</label>

              <ul>
                {seccondTeam.map(item => {
                  return(
                    <li key={item.encryptedId}>
                      <div className='player-container-list'>
                        <img alt='icon-player-list' className='icon-image-list' src={`http://ddragon.leagueoflegends.com/cdn/13.11.1/img/profileicon/${item.profileIconId}.png`}></img>
                        <div className='infos-player-list'>
                          <span>{item.nickName}</span>
                          <span style={{fontSize:'10px'}} className='elo'> {item.elo.replace('_', ' ')} </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
