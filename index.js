// https://api.gametools.network/docs
const { s, t, sleep, Random } = require('koishi')
const axios = require('axios')

t.set('bfstat', {
  'desc': '战地战绩查询',
  'tracker': 'bfstat [游戏简写] [ID]: 获取用户的战地战绩。',
  'hint': '请使用直播间号进行操作。可以通过 search 子命令进行相关的搜索。',
  's':    '查询玩家基本信息',
  'list': '查看已订阅的直播'
})
t.set('bfvstat', {
  'tracker': 'bfvstat [ID]: 获取 https://battlefieldtracker.com 战绩链接。'
})

function toPoint(percent){
  var str=percent.replace("%","");
  str= str/100;
  return str;
}

module.exports.name = 'bfstat'
module.exports.apply = (ctx, config) => {
  ctx.command('bfvstat [name]', t('bfvstat.tracker'))
    .action(async ({ session }, name) => {
    if (!name) return '未指定烂橘子用户名'
    return 'https://battlefieldtracker.com/bfv/profile/origin/'+name+'/overview'
  })
  ctx.command('bfstat [game] [name]', t('bfstat.tracker'))
    .action(async ({ session }, game, name) => {
/*
    if (!game) return '未指定游戏名，目前只支持 bf1 和 bfv'
    if (!name) return '未指定烂橘子用户名'
    if ( game == 'bf1' ) return 'https://battlefieldtracker.com/bf1/profile/pc/'+name
    if ( game == 'bfv' ) return 'https://battlefieldtracker.com/bfv/profile/origin/'+name+'/overview'
    return '无效的游戏名，目前只支持 bf1 和 bfv'
*/
      if (name) {
        axios.get(
          "https://api.gametools.network/" + game + "/stats/?name=" + name
        ).then(item => {
          bfData = item.data
          playerInfo = "ID："+ bfData . userName + "[" + bfData.id + "]" + "\n" +
            "游戏：" + game + "\n" +
            "等级：" + bfData.rank + "；胜率：" + bfData.winPercent + "\n" +
            "KD：" + bfData.killDeath + "[" + bfData.kills + "-" + bfData.deaths + "]\n" +
            "命中率：" + bfData.accuracy + "；爆头率：" + bfData. headshots + "\n" +
            "最远爆头：" + bfData.longestHeadShot + "米\n" +
            "更多信息请参考：" + "https://gametools.network/stats/pc/name/"+name+"?game="+game
          session.send(playerInfo)
        })
        .catch(err => {
          session.send('错误：' + err)
        })
      }
      if (name) {
        axios.get(
          "https://api.gametools.network/" + game + "/weapons/?lang=zh-cn&name=" + name
        ).then(item => {
          wpData = item.data
          wpData.weapons.sort(function (a, b) {
            return toPoint(b.headshots) - toPoint(a.headshots)
          })
          playerWeapons = "ID："+ wpData . userName + "[" + wpData.id + "]" + "\n" +
            "武器爆头率前十：\n"
          for (i=0; i<10 && i<wpData.weapons.length; i++) { 
            playerWeapons = playerWeapons + wpData.weapons[i].weaponName + "：\n  " +
            "命中击杀比：" + wpData.weapons[i].hitVKills +
            "；击杀数：" + wpData.weapons[i].kills +
            "；爆头率：" + wpData.weapons[i].headshots + "\n"
          }
          session.send(playerWeapons)
        })
        .catch(err => {
          session.send('错误：' + err)
        })
      }
  })

  ctx.command('bfstat.s [name]', t('bfstat.s'))
    .action(async ({ session }, name) => {
    return '玩家基本信息: '+name
  })
}

