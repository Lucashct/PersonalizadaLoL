import { openDb } from '../config/dbConfig';

export async function createTablePlayers() {
  openDb().then(db => {
    try {
      db.exec('CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY, encryptedId TEXT, nickName TEXT, profileIconId INTEGER, eloFlex TEXT, eloDuo TEXT, weightDuo INTEGER, weightFlex INTEGER, UNIQUE(encryptedId))');
    } catch(error) {
      console.log(error);
    }
  });
}

export async function insertPlayer(player) {
  openDb().then(db => {
    try {
      db.run('INSERT OR IGNORE INTO Players (encryptedId, nickName, profileIconId, eloFlex, eloDuo, weightDuo, weightFlex,)',
      [player.encryptedId, player.nickName, player.profileIconId, player.eloFlex, player.eloDuo, player.weightDuo, player.weightFlex]);
    } catch(error) {
      console.log(error);
    }
  });
}

export async function selectPlayers() {
  return openDb().then(db => {
    return db.all('SELECT * FROM Links')
    .then(res => res);
  })
}

export async function updatePlayer(player) {
  openDb().then(db => {
    try {
      db.run('UPDATE Players SET eloFlex = ?, eloDuo = ?, weightDuo = ?, weightFlex = ? WHERE id = ?',
      [player.eloFlex, player.eloDuo, player.weightDuo, player.weightFlex, player.id]);
    } catch(error) {
      console.log(error);
    }
  });
}

export async function deletePlayer(player) {
  openDb().then(db => {
    try {
      db.run('DELETE FROM Players WHERE id = ?', player.id);
    } catch(error) {
      console.log(error);
    }
  })
}