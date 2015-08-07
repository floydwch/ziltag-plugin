import riot from 'riot';


const STAGING_SERVER = 'staging.ziltag.com';
const LOGIN_API = 'http://' + STAGING_SERVER + '/api/v1/sessions';

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
        <div class='ziltag-toolbar-ziltag'></div>
        <div onclick={close_toolbar} class='ziltag-toolbar-close'></div>
    </div>
    `,
    function(opts) {
        this.show_login_form = (e) => {
            let ziltag_plugin = document.getElementsByTagName('ziltag-plugin')[0];
            if(!ziltag_plugin.dataset['auth']) {
                let form = document.getElementsByClassName('ziltag-login-form')[0];
                form.classList.add('ziltag-login-form--active');
            }
            e.stopPropagation();
        };

        this.submit_login_form = (e) => {
            let form = document.getElementsByClassName('ziltag-login-form')[0];

            fetch(LOGIN_API, {
                method: 'post',
                body: new FormData(form)
            }).then((response) => {
                return response.json();
            }).then((json) => {
                let ziltag_plugin = document.getElementsByTagName('ziltag-plugin')[0];
                ziltag_plugin.dataset['auth'] = true;

                let form = document.getElementsByClassName('ziltag-login-form')[0];
                form.classList.remove('ziltag-login-form--active');

                let avatar = json['avatar']['thumb'];
                let login_btn = document.getElementsByClassName('ziltag-login-btn')[0];

                login_btn.classList.remove('ziltag-login-btn--unauth');
                login_btn.style.backgroundImage = `url(${avatar})`;

                let toolbar = document.getElementsByClassName('ziltag-toolbar')[0];
                toolbar.classList.add('ziltag-toolbar--shrink');
            });

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
                form.classList.remove('ziltag-login-form--active');
            }
        });
    }
);
