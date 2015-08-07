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
    <div class='ziltag-toolbar'></div>
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
