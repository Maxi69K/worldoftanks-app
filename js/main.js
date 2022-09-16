// WOT Player Statistics
const userInput = document.getElementById('searchPl')
const playerResults = document.getElementById('player-results')
const playerUsername = document.getElementById('player-username')
const searchPlayersBtn = document.getElementById('search-players')
const rating = document.getElementById('rating')
const playerRatings = document.getElementById('player-ratings-btn')
const playerRatingText = document.getElementById('player-rating-text')
let API_URL = `http://api.worldoftanks.eu`
let searchingPlayers = null
let playerStatisticRandom = null
let playerClan = null
let userName = null
let playerId = null
let playerClanId = null
let playerClanName = null
let allVehicles = null
let tankIdArray = []
let playerVehicles = null
let vehicleName = null

searchPlayersBtn.addEventListener('click', (e) => {
    e.preventDefault()

    searchingPlayers = `https://api.worldoftanks.eu/wot/account/list/?application_id=3ee041a1b413c421bbe811d12b32ba31&language=en&search=${userInput.value}&type=startswith`

    getSearchingPlayers(searchingPlayers)
    userInput.value = ''
})

async function getSearchingPlayers(url) {
    const res = await fetch(url)
    const data = await res.json()
    const players = data.data
    playerResults.innerHTML = ''

    players.forEach(player => {

        playerId = player.account_id

        let playerNickname = player.nickname

        playerResults.innerHTML += `<span class="players-found">${playerNickname}</span>`

        const playersFound = document.querySelectorAll('.players-found')

        playersFound.forEach(playerFound => playerFound.addEventListener('click', e => {
            userName = e.target.innerText
            userInput.value = ''
            playerResults.innerHTML = ''
            playerUsername.innerHTML = userName
            playerUsername.addEventListener('click', () => {
                for (let i = 0; i < players.length; i++) {
                    if (userName === players[i].nickname) {
                        playerId = players[i].account_id
                    }
                }
                playerStatisticRandom = `https://api.worldoftanks.eu/wot/account/info/?application_id=3ee041a1b413c421bbe811d12b32ba31&account_id=${playerId}&extra=statistics.random&language=en`
                getPlayersStatisticRandom(playerStatisticRandom)
                playerRatings.innerHTML = `
                <button class="rbtn" id="all">All</button>
                <button class="rbtn" id="clan">Clan</button>
                <button class="rbtn" id="company">Company</button>
                <button class="rbtn" id="historical">Historical</button>
                <button class="rbtn" id="random">Random</button>
                <button class="rbtn" id="regular_team">Regular team</button>
                <button class="rbtn" id="stronghold_defense">Stronghold defense</button>
                <button class="rbtn" id="stronghold_skirmish">Stronghold skirmish</button>
                <button class="rbtn" id="team">Team</button>
                <button class="rbtn" id="vehicles">Player top 50 vehicles</button>
                `
                getPlayersVehicles(url)
            })
        }))
    })
}

async function getPlayersStatisticRandom(url) {
    const res = await fetch(url)
    const data = await res.json()
    const playersStatistic = data.data
    playerClanId = playersStatistic[playerId].clan_id
    const playerCreated = playersStatistic[playerId].created_at
    const playerGlobalRating = playersStatistic[playerId].global_rating
    const playerLastBattleTime = playersStatistic[playerId].last_battle_time
    playerClan = `https://api.worldoftanks.eu/wot/clans/info/?application_id=3ee041a1b413c421bbe811d12b32ba31&clan_id=${playerClanId}&language=en`
    clan(playerClan)
    const ratingBtns = document.querySelectorAll('.rbtn')
    const accCreated = new Date(playerCreated * 1000)
    const lastBattle = new Date(playerLastBattleTime * 1000)
    rating.innerHTML = `<p>Global rating: <span class="rt">${playerGlobalRating}</span></p>`
    rating.innerHTML += `<p>Account created: <span class="rt">${accCreated.getDate()}/${accCreated.getMonth()+1}/${accCreated.getFullYear()}</span></p>`
    rating.innerHTML += `<p>Last battle: <span class="rt">${lastBattle.getDate()}/${lastBattle.getMonth()+1}/${lastBattle.getFullYear()}</span></p>`

    ratingBtns.forEach(ratingBtn => {
        ratingBtn.addEventListener('click', e => {
            let rBtnId = e.target.id
            playerRatingText.innerHTML = ''
            plStatsConverter(rBtnId)

            function plStatsConverter(type) {
                let pl = playersStatistic[playerId]

                if (type === 'all') {
                    playerRatingText.innerHTML = `
            <p><span>ALL</span></p>
            <p>Avg damage assisted:<span>${pl.statistics.all.avg_damage_assisted}</span></p>
            <p>Avg damage assisted radio:<span>${pl.statistics.all.avg_damage_assisted_radio}</span></p>
            <p>Avg damage assisted track:<span>${pl.statistics.all.avg_damage_assisted_track}</span></p>
            <p>Battles:<span>${pl.statistics.all.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.all.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.all.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.all.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.all.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.all.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.all.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.all.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.all.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.all.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.all.frags}</span></p>
            <p>Hits:<span>${pl.statistics.all.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.all.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.all.losses}</span></p>
            <p>Max damage:<span>${pl.statistics.all.max_damage}</span></p>
            <p>Max damage tank id:<span>${pl.statistics.all.max_damage_tank_id}</span></p>
            <p>Max frags:<span>${pl.statistics.all.max_frags}</span></p>
            <p>Max frags tank id:<span>${pl.statistics.all.max_frags_tank_id}</span></p>
            <p>Max xp:<span>${pl.statistics.all.max_xp}</span></p>
            <p>Max xp tank id:<span>${pl.statistics.all.max_xp_tank_id}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.all.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.all.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.all.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.all.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.all.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.all.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.all.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.all.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.all.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.all.wins}</span></p>
            <p>Xp:<span>${pl.statistics.all.xp}</span></p>
            `
                }
                if (type === 'clan') {
                    playerRatingText.innerHTML = `
            <p><span>CLAN</span></p>
            <p>Avg damage assisted:<span>${pl.statistics.clan.avg_damage_assisted}</span></p>
            <p>Avg damage assisted radio:<span>${pl.statistics.clan.avg_damage_assisted_radio}</span></p>
            <p>Avg damage assisted track:<span>${pl.statistics.clan.avg_damage_assisted_track}</span></p>
            <p>Avg damage blocked:<span>${pl.statistics.clan.avg_damage_blocked}</span></p>
            <p>Battle avg xp:<span>${pl.statistics.clan.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.clan.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.clan.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.clan.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.clan.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.clan.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.clan.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.clan.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.clan.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.clan.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.clan.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.clan.frags}</span></p>
            <p>Hits:<span>${pl.statistics.clan.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.clan.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.clan.losses}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.clan.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.clan.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.clan.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.clan.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.clan.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.clan.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.clan.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.clan.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.clan.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.clan.wins}</span></p>
            <p>Xp:<span>${pl.statistics.clan.xp}</span></p>
            `
                }
                if (type === 'company') {
                    playerRatingText.innerHTML = `
            <p><span>COMPANY</span></p>
            <p>Avg damage assisted:<span>${pl.statistics.company.avg_damage_assisted}</span></p>
            <p>Avg damage assisted radio:<span>${pl.statistics.company.avg_damage_assisted_radio}</span></p>
            <p>Avg damage assisted track:<span>${pl.statistics.company.avg_damage_assisted_track}</span></p>
            <p>Avg damage blocked:<span>${pl.statistics.company.avg_damage_blocked}</span></p>
            <p>Battle avg xp:<span>${pl.statistics.company.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.company.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.company.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.company.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.company.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.company.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.company.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.company.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.company.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.company.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.company.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.company.frags}</span></p>
            <p>Hits:<span>${pl.statistics.company.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.company.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.company.losses}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.company.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.company.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.company.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.company.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.company.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.company.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.company.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.company.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.company.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.company.wins}</span></p>
            <p>Xp:<span>${pl.statistics.company.xp}</span></p>
            `
                }
                if (type === 'historical') {
                    playerRatingText.innerHTML = `
            <p><span>HISTORICAL</span></p>
            <p>Avg damage assisted:<span>${pl.statistics.historical.avg_damage_assisted}</span></p>
            <p>Avg damage assisted radio:<span>${pl.statistics.historical.avg_damage_assisted_radio}</span></p>
            <p>Avg damage assisted track:<span>${pl.statistics.historical.avg_damage_assisted_track}</span></p>
            <p>Avg damage blocked:<span>${pl.statistics.historical.avg_damage_blocked}</span></p>
            <p>Battle avg xp:<span>${pl.statistics.historical.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.historical.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.historical.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.historical.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.historical.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.historical.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.historical.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.historical.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.historical.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.historical.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.historical.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.historical.frags}</span></p>
            <p>Hits:<span>${pl.statistics.historical.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.historical.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.historical.losses}</span></p>
            <p>Max damage:<span>${pl.statistics.historical.max_damage}</span></p>
            <p>Max damage tank id:<span>${pl.statistics.historical.max_damage_tank_id}</span></p>
            <p>Max frags:<span>${pl.statistics.historical.max_frags}</span></p>
            <p>Max frags tank id:<span>${pl.statistics.historical.max_frags_tank_id}</span></p>
            <p>Max xp:<span>${pl.statistics.historical.max_xp}</span></p>
            <p>Max xp tank id:<span>${pl.statistics.historical.max_xp_tank_id}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.historical.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.historical.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.historical.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.historical.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.historical.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.historical.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.historical.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.historical.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.historical.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.historical.wins}</span></p>
            <p>Xp:<span>${pl.statistics.historical.xp}</span></p>
            `
                }
                if (type === 'random') {
                    playerRatingText.innerHTML = `
            <p><span>RANDOM</span></p>
            <p>Avg damage assisted:<span>${pl.statistics.random.avg_damage_assisted}</span></p>
            <p>Avg damage assisted radio:<span>${pl.statistics.random.avg_damage_assisted_radio}</span></p>
            <p>Avg damage assisted track:<span>${pl.statistics.random.avg_damage_assisted_track}</span></p>
            <p>Avg damage blocked:<span>${pl.statistics.random.avg_damage_blocked}</span></p>
            <p>Battle avg xp:<span>${pl.statistics.random.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.random.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.random.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.random.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.random.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.random.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.random.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.random.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.random.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.random.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.random.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.random.frags}</span></p>
            <p>Hits:<span>${pl.statistics.random.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.random.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.random.losses}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.random.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.random.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.random.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.random.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.random.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.random.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.random.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.random.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.random.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.random.wins}</span></p>
            <p>Xp:<span>${pl.statistics.random.xp}</span></p>
            `
                }
                if (type === 'regular_team') {
                    playerRatingText.innerHTML = `
            <p><span>REGULAR TEAM</span></p>        
            <p>Avg damage assisted:<span>${pl.statistics.regular_team.avg_damage_assisted}</span></p>
            <p>Avg damage assisted radio:<span>${pl.statistics.regular_team.avg_damage_assisted_radio}</span></p>
            <p>Avg damage assisted track:<span>${pl.statistics.regular_team.avg_damage_assisted_track}</span></p>
            <p>Avg damage blocked:<span>${pl.statistics.regular_team.avg_damage_blocked}</span></p>
            <p>Battle avg xp:<span>${pl.statistics.regular_team.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.regular_team.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.regular_team.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.regular_team.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.regular_team.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.regular_team.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.regular_team.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.regular_team.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.regular_team.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.regular_team.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.regular_team.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.regular_team.frags}</span></p>
            <p>Hits:<span>${pl.statistics.regular_team.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.regular_team.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.regular_team.losses}</span></p>
            <p>Max damage:<span>${pl.statistics.regular_team.max_damage}</span></p>
            <p>Max damage tank id:<span>${pl.statistics.regular_team.max_damage_tank_id}</span></p>
            <p>Max frags:<span>${pl.statistics.regular_team.max_frags}</span></p>
            <p>Max frags tank id:<span>${pl.statistics.regular_team.max_frags_tank_id}</span></p>
            <p>Max xp:<span>${pl.statistics.regular_team.max_xp}</span></p>
            <p>Max xp tank id:<span>${pl.statistics.regular_team.max_xp_tank_id}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.regular_team.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.regular_team.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.regular_team.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.regular_team.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.regular_team.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.regular_team.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.regular_team.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.regular_team.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.regular_team.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.regular_team.wins}</span></p>
            <p>Xp:<span>${pl.statistics.regular_team.xp}</span></p>
            `
                }
                if (type === 'stronghold_defense') {
                    playerRatingText.innerHTML = `
            <p><span>STRONGHOLD DEFENSE</span></p>
            <p>Battle avg xp:<span>${pl.statistics.stronghold_defense.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.stronghold_defense.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.stronghold_defense.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.stronghold_defense.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.stronghold_defense.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.stronghold_defense.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.stronghold_defense.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.stronghold_defense.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.stronghold_defense.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.stronghold_defense.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.stronghold_defense.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.stronghold_defense.frags}</span></p>
            <p>Hits:<span>${pl.statistics.stronghold_defense.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.stronghold_defense.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.stronghold_defense.losses}</span></p>
            <p>Max damage:<span>${pl.statistics.stronghold_defense.max_damage}</span></p>
            <p>Max damage tank id:<span>${pl.statistics.stronghold_defense.max_damage_tank_id}</span></p>
            <p>Max frags:<span>${pl.statistics.stronghold_defense.max_frags}</span></p>
            <p>Max frags tank id:<span>${pl.statistics.stronghold_defense.max_frags_tank_id}</span></p>
            <p>Max xp:<span>${pl.statistics.stronghold_defense.max_xp}</span></p>
            <p>Max xp tank id:<span>${pl.statistics.stronghold_defense.max_xp_tank_id}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.stronghold_defense.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.stronghold_defense.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.stronghold_defense.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.stronghold_defense.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.stronghold_defense.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.stronghold_defense.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.stronghold_defense.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.stronghold_defense.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.stronghold_defense.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.stronghold_defense.wins}</span></p>
            <p>Xp:<span>${pl.statistics.stronghold_defense.xp}</span></p>
            `
                }
                if (type === 'stronghold_skirmish') {
                    playerRatingText.innerHTML = `
            <p><span>STRONGHOLD SKIRMISH</span></p>
            <p>Battle avg xp:<span>${pl.statistics.stronghold_skirmish.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.stronghold_skirmish.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.stronghold_skirmish.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.stronghold_skirmish.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.stronghold_skirmish.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.stronghold_skirmish.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.stronghold_skirmish.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.stronghold_skirmish.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.stronghold_skirmish.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.stronghold_skirmish.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.stronghold_skirmish.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.stronghold_skirmish.frags}</span></p>
            <p>Hits:<span>${pl.statistics.stronghold_skirmish.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.stronghold_skirmish.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.stronghold_skirmish.losses}</span></p>
            <p>Max damage:<span>${pl.statistics.stronghold_skirmish.max_damage}</span></p>
            <p>Max damage tank id:<span>${pl.statistics.stronghold_skirmish.max_damage_tank_id}</span></p>
            <p>Max frags:<span>${pl.statistics.stronghold_skirmish.max_frags}</span></p>
            <p>Max frags tank id:<span>${pl.statistics.stronghold_skirmish.max_frags_tank_id}</span></p>
            <p>Max xp:<span>${pl.statistics.stronghold_skirmish.max_xp}</span></p>
            <p>Max xp tank id:<span>${pl.statistics.stronghold_skirmish.max_xp_tank_id}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.stronghold_skirmish.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.stronghold_skirmish.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.stronghold_skirmish.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.stronghold_skirmish.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.stronghold_skirmish.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.stronghold_skirmish.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.stronghold_skirmish.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.stronghold_skirmish.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.stronghold_skirmish.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.stronghold_skirmish.wins}</span></p>
            <p>Xp:<span>${pl.statistics.stronghold_skirmish.xp}</span></p>
            `
                }
                if (type === 'team') {
                    playerRatingText.innerHTML = `
            <p><span>TEAM</span></p>
            <p>Avg damage assisted:<span>${pl.statistics.team.avg_damage_assisted}</span></p>
            <p>Avg damage assisted radio:<span>${pl.statistics.team.avg_damage_assisted_radio}</span></p>
            <p>Avg damage assisted track:<span>${pl.statistics.team.avg_damage_assisted_track}</span></p>
            <p>Avg damage blocked:<span>${pl.statistics.team.avg_damage_blocked}</span></p>
            <p>Battle avg xp:<span>${pl.statistics.team.battle_avg_xp}</span></p>
            <p>Battles:<span>${pl.statistics.team.battles}</span></p>
            <p>Battles on stunning vehicles:<span>${pl.statistics.team.battles_on_stunning_vehicles}</span></p>
            <p>Capture points:<span>${pl.statistics.team.capture_points}</span></p>
            <p>Damage dealt:<span>${pl.statistics.team.damage_dealt}</span></p>
            <p>Damage received:<span>${pl.statistics.team.damage_received}</span></p>
            <p>Direct hits received:<span>${pl.statistics.team.direct_hits_received}</span></p>
            <p>Draws:<span>${pl.statistics.team.draws}</span></p>
            <p>Dropped capture points:<span>${pl.statistics.team.dropped_capture_points}</span></p>
            <p>Explosion hits:<span>${pl.statistics.team.explosion_hits}</span></p>
            <p>Explosion hits received:<span>${pl.statistics.team.explosion_hits_received}</span></p>
            <p>Frags:<span>${pl.statistics.team.frags}</span></p>
            <p>Hits:<span>${pl.statistics.team.hits}</span></p>
            <p>Hits percents:<span>${pl.statistics.team.hits_percents}</span></p>
            <p>Losses:<span>${pl.statistics.team.losses}</span></p>
            <p>Max damage:<span>${pl.statistics.team.max_damage}</span></p>
            <p>Max damage tank id:<span>${pl.statistics.team.max_damage_tank_id}</span></p>
            <p>Max frags:<span>${pl.statistics.team.max_frags}</span></p>
            <p>Max frags tank id:<span>${pl.statistics.team.max_frags_tank_id}</span></p>
            <p>Max xp:<span>${pl.statistics.team.max_xp}</span></p>
            <p>Max xp tank id:<span>${pl.statistics.team.max_xp_tank_id}</span></p>
            <p>No damage direct hits received:<span>${pl.statistics.team.no_damage_direct_hits_received}</span></p>
            <p>Piercings:<span>${pl.statistics.team.piercings}</span></p>
            <p>Piercings received:<span>${pl.statistics.team.piercings_received}</span></p>
            <p>Shots:<span>${pl.statistics.team.shots}</span></p>
            <p>Spotted:<span>${pl.statistics.team.spotted}</span></p>
            <p>Stun assisted damage:<span>${pl.statistics.team.stun_assisted_damage}</span></p>
            <p>Stun number:<span>${pl.statistics.team.stun_number}</span></p>
            <p>Survived battles:<span>${pl.statistics.team.survived_battles}</span></p>
            <p>Tanking factor:<span>${pl.statistics.team.tanking_factor}</span></p>
            <p>Wins:<span>${pl.statistics.team.wins}</span></p>
            <p>Xp:<span>${pl.statistics.team.xp}</span></p>
            `
                }
            }
        })
    })
}

async function getPlayersVehicles(url) {
    url = `https://api.worldoftanks.eu/wot/account/tanks/?application_id=3ee041a1b413c421bbe811d12b32ba31&account_id=${playerId}&language=en`
    const res2 = await fetch(url)
    const data2 = await res2.json()
    const vehicles = data2.data
    allVehicles = vehicles[playerId]
    let plVehicles = document.getElementById('vehicles')
    plVehicles.addEventListener('click', () => {

        for (let i = 0; i < allVehicles.length; i++) {
            let tankId = allVehicles[i].tank_id
            tankIdArray.push(tankId)
        }

        let num = 0
        for (let i = 0; i < tankIdArray.length; i++) {
            let allPlayerTanks = tankIdArray[i]

            vehicleName = `https://api.worldoftanks.eu/wot/encyclopedia/vehicles/?application_id=3ee041a1b413c421bbe811d12b32ba31&tank_id=${allPlayerTanks}&language=en`
            vehiclesName(vehicleName)
            async function vehiclesName(url) {
                const res = await fetch(url)
                const data = await res.json()
                const vehicle = data.data
                /* let playerVehicleName = vehicle[allPlayerTanks].name */
                let playerVehicleNameId = vehicle[allPlayerTanks].tank_id
                if (num < 50) {
                    playerRatingText.innerHTML += `
        <span id="${playerVehicleNameId}" class="ccw-word" data-type="vehicle_wot__eu">${vehicle[allPlayerTanks].name}</span>
        <span class="vehiclesStats"></span>
        `
                    num++
                }

                const classVehicles = document.querySelectorAll('.ccw-word')
                classVehicles.forEach(classVehicle => classVehicle.addEventListener('click', getPlayersVehiclesName))
            }
        }
    })
}


async function getPlayersVehiclesName(url) {
    const vehiclesStats = document.querySelectorAll('.vehiclesStats')
    for (let i = 0; i < tankIdArray.length; i++) {
        let allPlayerTanks = tankIdArray[i]
        let vehiclesStat = vehiclesStats[i]
        url = `https://api.worldoftanks.eu/wot/tanks/stats/?application_id=3ee041a1b413c421bbe811d12b32ba31&account_id=${playerId}&language=en&tank_id=${allPlayerTanks}`

        const res = await fetch(url)
        const data = await res.json()
        const vehicle = data.data
        vehiclesStat.innerHTML = `
        Battles: ${vehicle[playerId][0].all.battles}<br>
        Wins: ${vehicle[playerId][0].all.wins}<br>
        Losses: ${vehicle[playerId][0].all.losses}<br>
        Survived battles: ${vehicle[playerId][0].all.survived_battles}<br>
        Battle avg XP: ${vehicle[playerId][0].all.battle_avg_xp}<br>
        Hits percents: ${vehicle[playerId][0].all.hits_percents}<br>
        Mark of mastery: ${vehicle[playerId][0].mark_of_mastery}<br>
        Max frags: ${vehicle[playerId][0].max_frags}<br>
        Max XP: ${vehicle[playerId][0].max_xp}
        `
    }
}

async function clan(playerClan) {
    const res = await fetch(playerClan)
    const data = await res.json()
    const clans = data.data

    if (playerClanId != null) {
        playerClanName = clans[playerClanId].name
        rating.innerHTML += `<img src="${clans[playerClanId].emblems.x64.portal}" alt="Clan Logo">`
        rating.innerHTML += `<p>Clan: <span style="color:${clans[playerClanId].color};">[${clans[playerClanId].tag}]</span> <span class="rt">${playerClanName}</span></p>`
        rating.innerHTML += `<p>Leader name: <span class="rt">${clans[playerClanId].leader_name}</span></p>`
        rating.innerHTML += `<p>Members count: <span class="rt">${clans[playerClanId].members_count}</span></p>`
    }
}