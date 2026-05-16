fx_version 'cerulean'
game 'rdr3'
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

author 'Madd'
version '1.0.1'
description 'Loading Screen'
lua54 'yes'

client_scripts {
    'client/main.lua',
}

server_scripts {
    'server/main.lua',
    'server/handover.js',
}

files {
    'html/index.html',
    'html/config.js',
    'html/assets/js/*.js',
    'html/assets/css/*.css',
    'html/assets/img/*.*',
    'html/assets/music/*.*',
    'html/assets/video/*.*',
    'html/assets/fonts/*.*'
}

loadscreen 'html/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'
