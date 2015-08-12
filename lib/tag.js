import riot from 'riot';
import uuid from 'uuid';
import 'whatwg-fetch';
import $ from 'jquery';
import '../vendor/redactor/redactor.js';
import '../vendor/redactor/video.js';
import '../vendor/redactor/zh_tw.js';
import '../vendor/redactor/redactor.css';


const STAGING_SERVER = 'staging.ziltag.com';
const LOGIN_API = 'http://' + STAGING_SERVER + '/api/v1/sessions';
const SUBMIT_PHOTO_API = 'http://' + STAGING_SERVER + '/api/v1/redactor';
const ZILTAG_API = 'http://' + STAGING_SERVER + '/api/v1/ziltag';
const USER_API = 'http://' + STAGING_SERVER + '/api/v1/users/';
const ZILTAG_FETCH_API = 'http://' + STAGING_SERVER + 'api/v1/ziltaggings';

riot.tag('ziltag-plugin',
    `
    <button onclick={show_login_form} class='ziltag-login-btn ziltag-login-btn--unauth'></button>
    <form onsubmit={submit_login_form} autocomplete='off' class='ziltag-login-form'>
        <div class='ziltag-login-form-board'>
            <input type='text' name='login' placeholder='Email 信箱' class='ziltag-login-form-email'>
            <hr>
            <input type='password' name='password' placeholder='密碼' class='ziltag-login-form-password'>
        </div>
        <br>
        <input type='submit' value='登入' class='ziltag-login-form-submit'>
    </form>
    <div class='ziltag-toolbar'>
        <div onclick={open_toolbar} class='ziltag-toolbar-open'></div>
        <div draggable='true' class='ziltag-toolbar-ziltag'></div>
        <div onclick={close_toolbar} class='ziltag-toolbar-close'></div>
    </div>
    <div class='ziltag-edit-cover'></div>
    <div class='ziltag-edit-board'>
        <div class='ziltag-edit-board-head'>
            新增樂貼
            <div class='ziltag-edit-board-cancel'></div>
        </div>
        <div class='ziltag-edit-board-panel'>
            <input type='text' placeholder='標題' class='ziltag-edit-board-panel-title'>
            <div class='ziltag-edit-board-panel-editor'></div>
            <div type='text' class='ziltag-edit-board-panel-hashtags'>
                <input type='text' placeholder='#主題標籤' class='ziltag-edit-board-panel-hashtags-input'>
            </div>
            <button class='ziltag-edit-board-panel-submit'>發佈</button>
        </div>
    </div>
    `,
    function(opts) {

        this.on('mount', () => {
            fetch(USER_API + 'me', {
                credentials: 'include'
            })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if(json['id']) {
                    post_login(json);
                }
            });
        });

        this.show_login_form = (e) => {
            let ziltag_plugin = document.getElementsByTagName('ziltag-plugin')[0];
            if(!ziltag_plugin.dataset['auth']) {
                let form = document.getElementsByClassName('ziltag-login-form')[0];
                form.style.display = 'block';
            }
            e.stopPropagation();
        };

        let post_login = (json) => {

            let ziltag_plugin = document.getElementsByTagName('ziltag-plugin')[0];
            ziltag_plugin.dataset['auth'] = true;

            let form = document.getElementsByClassName('ziltag-login-form')[0];
            form.style.display = 'none';

            let avatar = json['avatar']['thumb'];
            let login_btn = document.getElementsByClassName('ziltag-login-btn')[0];

            login_btn.classList.remove('ziltag-login-btn--unauth');
            login_btn.style.backgroundImage = `url(${avatar})`;

            let toolbar = document.getElementsByClassName('ziltag-toolbar')[0];
            toolbar.classList.add('ziltag-toolbar--shrink');

            let imgs = document.getElementsByTagName('img');
            let current_img;
            let current_x;
            let current_y;

            for(let i = 0; i < imgs.length; i++) {
                let img = imgs[i];

                img.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                img.addEventListener('drop', (e) => {
                    let x = e.layerX -24;
                    let y = e.layerY -19;
                    let tag_type = e.dataTransfer.getData('type');

                    current_x = x;
                    current_y = y;

                    current_img = e.target;

                    if(tag_type == 'add-ziltag') {
                        let ziltag = document.createElement('div');
                        ziltag.setAttribute('class', 'ziltag-toolbar-ziltag');
                        ziltag.setAttribute('draggable', true);
                        ziltag.style.display = 'block';
                        ziltag.style.position = 'absolute';
                        ziltag.style.left = x + 'px';
                        ziltag.style.top = y + 'px';
                        ziltag.id = `ziltag-${uuid()}`;
                        ziltag.addEventListener('dragstart', (e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('type', 'move-ziltag');
                            e.dataTransfer.setData('id', ziltag.id);
                        });
                        e.target.parentNode.appendChild(ziltag);

                        let cover = document.getElementsByClassName('ziltag-edit-cover')[0];
                        let board = document.getElementsByClassName('ziltag-edit-board')[0];
                        let panel = document.getElementsByClassName('ziltag-edit-board-panel')[0];
                        let editor = document.getElementsByClassName('ziltag-edit-board-panel-editor')[0];

                        cover.style.display = 'block';
                        board.style.display = 'block';

                        $(editor).redactor({
                            lang: 'zh_tw',
                            imageUpload: SUBMIT_PHOTO_API
                        });

                        let hashtag_manager = document.getElementsByClassName('ziltag-edit-board-panel-hashtags')[0];
                        let hashtag_input = document.getElementsByClassName('ziltag-edit-board-panel-hashtags-input')[0];
                        hashtag_input.addEventListener('keypress', (e) => {
                            let hashtag_input_value = hashtag_input.value.trim();

                            if(e.keyCode == 13 && hashtag_input_value != '') {
                                let hashtag = document.createElement('div');
                                hashtag.textContent = hashtag_input_value;
                                let hashtag_cancel = document.createElement('span');
                                hashtag_cancel.classList.add('ziltag-edit-board-panel-hashtags-hashtag-cancel');
                                hashtag_cancel.textContent = 'x';
                                hashtag_cancel.addEventListener('click', () => {
                                    hashtag_manager.removeChild(hashtag);
                                });
                                hashtag.appendChild(hashtag_cancel);
                                hashtag_input.value = '';
                                hashtag.classList.add('ziltag-edit-board-panel-hashtags-hashtag');
                                hashtag_manager.insertBefore(hashtag, hashtag_input);
                            }
                        });
                    }
                    // else if(tag_type == 'move-ziltag') {
                    //     let ziltag_id = e.dataTransfer.getData('id');
                    //     let ziltag = document.getElementById(ziltag_id);
                    //     ziltag.style.left = x + 'px';
                    //     ziltag.style.top = y + 'px';
                    //     e.target.parentNode.appendChild(ziltag);
                    // }
                });

                let cover = document.getElementsByClassName('ziltag-edit-cover')[0];
                let board = document.getElementsByClassName('ziltag-edit-board')[0];
                let cancel = document.getElementsByClassName('ziltag-edit-board-cancel')[0];
                let submit = document.getElementsByClassName('ziltag-edit-board-panel-submit')[0];

                let tear_down = (state) => {
                    let ziltag_tear_down = true;

                    if(state['ziltagging'] && state['ziltagging']['id']) {
                        ziltag_tear_down = false;
                    }

                    let hashtag_input = document.getElementsByClassName('ziltag-edit-board-panel-hashtags-input')[0];
                    hashtag_input.value = '';

                    let hashtags = document.getElementsByClassName('ziltag-edit-board-panel-hashtags-hashtag');
                    for(let i = hashtags.length - 1; i >= 0; i--) {
                        hashtags[i].parentNode.removeChild(hashtags[i]);
                    }

                    let title = document.getElementsByClassName('ziltag-edit-board-panel-title')[0];
                    title.value = '';

                    let editor = document.getElementsByClassName('ziltag-edit-board-panel-editor')[0];
                    $(editor).redactor('core.destroy');
                    editor.textContent = '';

                    cover.style.display = 'none';
                    board.style.display = 'none';

                    if(ziltag_tear_down) {
                        let ziltags = document.getElementsByClassName('ziltag-toolbar-ziltag');
                        let last_ziltag = ziltags[ziltags.length - 1];
                        last_ziltag.parentNode.removeChild(last_ziltag);
                    }
                };

                cover.addEventListener('click', tear_down);
                cancel.addEventListener('click', tear_down);
                submit.addEventListener('click', () => {
                    let title = document.getElementsByClassName('ziltag-edit-board-panel-title')[0].value;
                    let editor = document.getElementsByClassName('ziltag-edit-board-panel-editor')[0];
                    let article = $(editor).redactor('code.get');
                    let src = current_img.src;

                    let ziltag_data = {
                        photo: {
                            remote_image_url: src
                        },
                        post: {
                            title: title,
                            content: article,
                            published: true
                        },
                        ziltagging: {
                            x: current_x,
                            y: current_y
                        }
                    };

                    fetch(ZILTAG_API, {
                        method: 'post',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(ziltag_data)
                    })
                    .then((response) => {
                        return response.json();
                    })
                    .then(tear_down);
                });
            }

            let ziltag = document.getElementsByClassName('ziltag-toolbar-ziltag')[0];
            ziltag.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', 'add-ziltag');
            });
        };

        this.submit_login_form = (e) => {
            let form = document.getElementsByClassName('ziltag-login-form')[0];

            fetch(LOGIN_API, {
                method: 'post',
                credentials: 'include',
                body: new FormData(form)
            }).then((response) => {
                return response.json();
            }).then(post_login);

            e.preventDefault();
        };

        this.open_toolbar = (e) => {
            let toolbar_open = e.target;
            let toolbar_close = document.getElementsByClassName('ziltag-toolbar-close')[0];
            let toolbar = document.getElementsByClassName('ziltag-toolbar')[0];

            toolbar_open.style.display = 'none';
            toolbar_close.style.display = 'block';

            toolbar.classList.remove('ziltag-toolbar--shrink');
            toolbar.classList.add('ziltag-toolbar--expansion');
        };

        this.close_toolbar = (e) => {
            let toolbar_close = e.target;
            let toolbar_open = document.getElementsByClassName('ziltag-toolbar-open')[0];
            let toolbar = document.getElementsByClassName('ziltag-toolbar')[0];

            toolbar_close.style.display = 'none';
            toolbar_open.style.display = 'block';

            toolbar.classList.remove('ziltag-toolbar--expansion');
            toolbar.classList.add('ziltag-toolbar--shrink');
        };

        document.addEventListener('click', (e) => {
            let target = e.target;
            let form = document.getElementsByClassName('ziltag-login-form')[0];
            let click_on_form = false;

            if(target.classList.contains('ziltag-login-form')) {
                click_on_form = true;
            } else if(form.contains(target)) {
                click_on_form = true;
            }

            if(!click_on_form) {
                form.style.display = 'none';
            }
        });
    }
);
