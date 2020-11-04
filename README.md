# Extra Exchange

![Top](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/top_image.png)

## 概要

**「いらないもの ⇄ 欲しいもの」**

**ユーザー間で物々交換ができるサービスです。**

「誰かにとってのいらないもの」が、「誰かにとっての欲しいもの」となっていることはよくあることです。
このサービスでは、ユーザーの皆様が商品を投稿して、その商品同士をユーザー間で交換することでお互いが幸せになることができます。
取引は直接会って交換するので、郵送・梱包の手間もありません。

気楽にいらないものを処分し、自分の欲しいものをもらい、生活を豊かにすることができます。

## URL

[サイトトップページ](https://extra-exchane.herokuapp.com/top)

本サービスは、自分以外のユーザーが取引を送信または取引申請の承認を行う等、ユーザー間のやりとりがベースとなっております。
それに伴い、評価者様にとって確認が煩雑になってしまいますことをお詫び申し上げます。
少しでもご不便を感じずにご確認いただけるように、ゲスト用アカウントは 3 つご用意しておりますので、以下の 3 つのどれかのアカウントからログインしてご確認いただければ幸甚です。

- username : **`guest1`** / password : **`password000`**
- username : **`guest2`** / password : **`password000`**
- username : **`guest3`** / password : **`password000`**

## サービス概要 / 利用の流れ

### 1. ユーザー登録(ログイン)を行う

![Login](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/login.gif)

### 2. `欲しいものリスト`を作成する

各ユーザーは、自分の気になる商品を投稿している出品者の`欲しいものリスト`を参照し、それを自分が持っているか確認して交換が可能か判断をします。欲しいものは URL をつけることが可能で、URL をつけた場合はその欲しいものは`a`タグで表示されます。

![wantitem](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/wantitem.gif)

### 3. `商品`を投稿する

各ユーザーは自分のいらないものを投稿します。商品はカテゴリ分けされていて、画像も最低 1 枚投稿する必要があります。

![giveitem](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/giveitem.gif)

### 4.`ピックアップ地点`の追加

直接相対して取引を行うため、出品者が商品を渡せる場所を指定する必要があります。ピックアップ地点は最大で 3 件まで登録できます。テキストを使用することで、電車のみならずバス停などをピックアップ地点に登録することが可能です。

![pickup](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/pickup.gif)

### 5.リクエストを送る

商品の投稿者以外が商品の詳細ページにいくと、取引のリクエストを送信することができます。取引リクエストを送るには以下の 3 点を選択する必要があります。

- **`交換する商品`**(リクエストを送信するユーザー(以下、`ジョインユーザー`)の投稿した商品から)
- **`ピックアップ場所`**(商品を出品しているユーザー(以下、`ホストユーザー`)のピックアップ地点から)
- **`取引日時`**

![giveReq](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/give_send_req.gif)

※各商品へコメントを投稿することができます。これにより、リクエスト送信前に商品についての問い合わせを行うことができます(コメントを投稿後に削除することもできます)。

![comment](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/comment.gif)

### 6. リクエストを承認する(`ホストユーザー`)

`ホストユーザー`は、送信されたリクエストが適当か確認を行う必要があります。`取引日時`や、`ジョインユーザー`が提示する`商品`が適当であるなら`ホストユーザー`はリクエストを承認し、正式に取引が開始されます。

![confirmreq](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/confirmreq.gif)

### 7. 取引終了まで

取引当日まで、`ホストユーザ`ーと`ジョインユーザー`間でプライベートメッセージで打ち合わせを行うことができます。当日の目印となる服装、集合場所等を相手と話し合うのが一般的な打ち合わせ内容です。

取引が完全に完了させるには 3 ステップが必要です。

1. **`ジョインユーザー`の取引成立報告**
   
   `ジョインユーザー`が成立の報告を完了させない限り、`ホストユーザー`は取引完了の報告を送信することができません。

![joinaccept](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/joinaccept.gif)

2. **`ホストユーザー`の取引完了報告**
   
   `ジョインユーザー`の取引が成立されてはじめて、`ホストユーザー`は完了を報告することができます。取引成立報告後は取引を取り消しすることができません。

![donedeal](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/donedeal.gif)

3. **取引完了**
   
   `ホストユーザー`が取引完了を報告して正式に取引が完全に完了となります。

    取引完了後は、お互いの使用された商品はリクエストの送信に使用することもできず、画面上でも`Exchanged`と交換済みとマークされるようになります。

## 使用技術

### フロントエンド

- React 16.3.1
  - React Redux(redux-thunx)
  - styled-components(polished)
- HTML/CSS(Sass)
- JavaScript

### バックエンド

- Python 3.9.0
- Django 3.1.1
  - Django REST framework

### 外部 API

- [HeartRails Express](http://express.heartrails.com/)

### 開発環境

- MySQL

### 本番環境

- Heroku
  - WhiteNoise
  - Gunicorn
- PostgreSQL(Heroku Postgres)
- AWS(S3)

### その他

- Git flow を意識した開発
  - issue を発行、プルリクエストを作成し、Master とマージする際に issue もクローズするように記述
- Git コミットメッセージと issue 番号の紐付け
- Git コミットメッセージの規則を持った記述([参考](https://qiita.com/itosho/items/9565c6ad2ffc24c09364))
- Prettierを用いたコードフォーマット

## 機能一覧

### 認証機能

- 登録、サインイン機能(`django-rest-auth`,`django-allauth`)
  - 登録時にユーザー名(固有)、メールアドレス(固有)、パスワード必須
  - ログイン時にユーザー名、パスワード必須
  - 全ページでログインしているかを確認し、必要によっては表示の変更、トップ・ログイン画面へリダイレクト(`React Redux`)
- パスワード変更機能(`django-rest-auth`, `django-allauth`)

### 投稿機能

- `欲しいもの`
  - `欲しいもの`の新規作成,編集,削除(いずれも登録済みユーザー限定機能 ※閲覧は可能)
  - `欲しいもの`が URL を持っている場合、URL 先へ飛べるように条件分岐して表示
- `商品`
  - `商品`の新規作成、編集、削除(いずれも登録済みユーザー限定機能　※閲覧は可能)
  - 画像アップロード機能(画像専用の OneToMany 関係のテーブルを用意)
  - 詳細ページにて、関連している画像をカルーセルで表示(`React Swiper`)
  - 詳細ページにて、ゲストユーザー、ログインユーザー(リクエスト送信済みか否か、商品の投稿者か否か)、交換済みかで描画を変化し表示
  - ページネーションを用いて、カード形式でリスト表示(`react-paginate`)
  - 取引が終了した`商品`は Exchange のタグをつけて表示
- `ピックアップ地点`

  - 外部 API を用いて、東京都内の路線を全取得
  - ユーザーが選択した路線に応じて、その路線の全駅を取得
  - 上記の路線、駅を用いたドロップダウンを用いた新規投稿機能
  - テキストを用いた新規投稿機能
  - `ピックアップ地点`の新規投稿、削除(閲覧は可能)

- `カテゴリ`

  - カテゴリページにて、`商品`をカテゴリごとに表示
  - 商品詳細ページから編集可能

- `キーワード`

  - `欲しいものリスト`、`商品`それぞれにキーワードを設定(最大 3 つまで)
  - 上記 2 つそれぞれの編集画面から新規作成、編集、削除可能

- `リクエスト`

  - `リクエスト`の新規投稿、削除機能(登録済みユーザー限定機能)
  - リクエストの承認の状況によって、描画を変化し表示

- `取引`
  - `取引`の新規投稿、削除機能(登録済みユーザー限定機能)
  - `ジョインユーザー`の成立報告が完了するまで、`ホストユーザー`の完了報告を無効化
  - 取引完了後に、取引で使われた`商品`を交換済みに更新

### コメント機能

- `商品`詳細ページから各商品へのコメントの新規作成
- 投稿後にコメント削除可能(コメント投稿者限定機能)
- 投稿者が、その商品の出品者かそれ以外かのユーザーかで描画を変化し表示

### プライペートメッセージ機能

- `取引`詳細ページから各取引へのメッセージの新規作成
- 投稿後にメッセージ削除可能(メッセージ投稿者限定機能)
- 投稿者が、その取引の`ホストユーザー`か`ジョインユーザー`かで描画を変化し表示

### カテゴリ機能

- 全カテゴリページで、カテゴリごとに`商品`を表示

### ユーザー機能

- サイドバー(ユーザー情報ページ、アカウント情報編集ページ、パスワード変更ページ、欲しいものリスト追加・編集ページ、商品出品ページ、ピックアップリスト追加・編集ページ)は、訪問者がユーザー本人かで描画を変化し表示(本人以外なら、ユーザー情報ページへのリンクのみ表示)
- ユーザー詳細ページにて、ユーザーネーム、メールアドレス、アイコン、背景、プロフィールが編集可能
- ユーザー詳細ページにて、アイコン若しくは背景が未設定の場合、デフォルトの画像を表示
- ヘッダーへログアウトボタン設置(`django-rest-auth`, `django-allauth`)


## 制作背景

私が本サービスを作ったきっかけは2点あります。

それは、[**`①お金を介さない取引があっても良いとずっと考えていた`**,**`②アメリカでは直接会ってモノの受け渡しがされていることを発見した`**]の2点です。

  **1.お金を介さない取引について**
  
   私は以前より、人がモノを購入する時、特に消費者同士でそれがやり取りされる時、お金以外を取引に用いても良いと考えていました。ある人にとって「いらない」と感じたモノAが、他の人から見ればとても「欲しい」モノであること可能性は十分にあります。逆に、モノAを欲しがる人がいらないと感じるモノBがモノAの持ち主にとってほしいモノもあります。
   このように、お互いの需給が一致すればわらしべ長者のように物々交換によって取引が成立し、モノを手に入れる手段により幅が出ます。これを実現できるようなサービスがあれば、より生活しやすくなるだろうと私は考えており、また、自分でこのような生活を豊かにするサービスを作りたいと考えておりました。

  **2.アメリカでの発見について**
  
   私はアメリカ留学中に、「アメリカでは人同士が直接会って商品の受け渡しをする事がよくある」ということを知りました。アメリカのアプリの一つ`OfferUp`というアプリは、近くに住む住人同士で商品の売買ができるサービスです。近くに住んでいるという特性から、このアプリの利用者は直接会って商品を受け取っていました。また、アメリカの文化として、不要なモノを家の前に置いておき、目に止まった人へ譲る若しくは売るというものがあります。
   これらはどれも生活範囲が近いことを利用した、直接相対の取引です。これは、「空き箱を送り、交換相手を騙す」という物々交換を郵送で行う場合に起こり得る問題を解決するものだと私は考えました。

**以上より、私は自身の以前のアイデアと留学での経験を結びつけ、私が「社会にあったらいいな」と考えた本アプリを制作いたしました。**

## 工夫した点

**1:`DB設計で、ポリモーフィック関連にならないように設計したこと`**

**2:`Userモデルでアイコンと背景画像のみdeleteリクエストを受け付けるようにしたこと`**

1. DB設計について

    本アプリの`欲しいモノ`と`商品`、`リクエスト`と`取引`はそれぞれ親テーブルを持っています。DB設計を考えている際、複数の親テーブルを持つ場合外部性制約が保てないとしてポリモーフィック関連がアンチパターンの一つであるという記述を見かけました。テーブル間の整合性を保つために、共通の親テーブルを作成するように設計いたしました。

2. `User`モデルのアイコン画像、背景画像の削除

    `User`モデルはアイコン、背景画像のフィールドを持っており、良いUXの実現のために私はこの2つのフィールドの値のみをdeleteで削除したいと考えておりました。しかし、`Django REST framework`のデフォルトのViewではそれに対応する機能は用意されていません。これを実装するために、`Django`のドキュメントから読み直して、個別のメソッドを作成することで、アイコン、背景画像のフィールドを削除する機能の実装に成功しました。

## 苦労した点
最も苦労した点は、**`Django`の認証機能の実践**です。私のローカル環境でしか発生せず、原因不明のエラーが起きたために私はこの機能の実装成功に1週間かかるほど苦労いたしました。`stackoverflow`などの質問や、英語記事を見ても解決方法が見当たらず、認証機能の実装を見送ることも考えました。しかし、自分で公式ドキュメントを読み込んだり、パッケージのメソッドを詳細に見て、解決法を考えた結果、実装に成功いたしました。振り返れば良い方法ではありませんでしたが、`Qiita`の記事に投稿、ストックももらえたことに加えて、公式ドキュメントの重要性も分かり非常に力となったエラーです。

## 本アプリの発展、改善したい点

  * `Next.js`を使用して、静的サイトを作ることでSEO対策も取ったものにしたい
  * `TypeScript`を用いて、より保守性の高いプログラムにしたい
  * `Circle CI/CD`を用いて、自動デプロイができるようにする
  * 検索機能を導入して、よりUXの良いアプリにしたい
  * ページネーション機能を`Django REST framework`、つまりバックエンド側からも実装する。
  * Formなど共通のコードが多いため、共通コンポーネント化して可読性・保守性を上げる。


## 構成図

![structure](https://raw.github.com/wiki/Toshiyuki023Hori/extra_exchange/gifs/drawing_structure.jpg)

## ローカル環境の構築手順

**私は、Macを使用しているため環境構築にはMacを使用することを推奨いたします。**

**エラー対応の結果、パッケージを直接編集したため、ローカル環境の構築がやや煩雑になっています。**

1. ディレクトリを作り、そのディレクトリ内でターミナルを開き、`git init`コマンドを入力する。

2. 同ディレクトリ内で、`git clone https://github.com/Toshiyuki023Hori/extra_exchange.git`を入力する。

3. `cd extra_exchange`でディレクトリを移動した後、`python3 -m venv venv`を入力し、仮想環境を作成する。

4. 以下のコマンドを入力し、仮想環境を有効化する。
  * (Mac)`source venv/bin/activate`
  * (Windows)`venv\Scripts\activate`

5. `pip install -r requirements.txt`でパッケージをダウンロードする。

6. インストール後、`cd frontend`でディレクトリを移動した後、`npm install`でパッケージをダウンロードする。

7. `settings.py`96行目の、`DATABASES`を任意のものに変える。

8. `venv`内の、`rest_auth/registration/serializers.py`の、`RegisterSerializer`を以下のものに書き換える([参考](https://qiita.com/Toshiyuki023Hori/items/3a329854f6c7b81b1d56))。

```
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=allauth_settings.USERNAME_REQUIRED
    )
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
#
# password1とpassword2を削除してpasswordフィールド一つのみにしています。
#
    password = serializers.CharField(write_only=True)

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password(self, password):
        return get_adapter().clean_password(password)

    def custom_signup(self, request, user):
        pass

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password': self.validated_data.get('password', ''),
            'email': self.validated_data.get('email', '')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user
```

9. `allauth/account/adapter.py`の`save_user`メソッド内の`password1`を`password`に書き換える。

10. `extra_exchange`ディレクトリ直下で、仮想環境が有効化されている時に、`python manage.py makemigrations`を入力する。

11. `python manage.py migrate`を入力する。

12. `python manage.py runserver`を入力する。

13. `frontend`ディレクトリ直下で、`npm start`を入力する。

14. `localhost:3000/registration`からユーザーを作成する。

15. `frontend/src/containers/Pages/Top.jsx`22行目の通り、`メンズ服、レディース服、ゲーム`をカテゴリに追加するか、任意のカテゴリーのクエリを作成して、作成したクエリと同名になるよう`Top.jsx`22行目と書き換える。