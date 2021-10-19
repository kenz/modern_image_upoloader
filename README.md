# modern_image_uploader
## 概要
画像のファイルをアップロードするのに最大容量 3MBみたいな制限に引っかかり苦労した経験はありませんか？
そうでなくても、撮影した画像をそのままアップロードするのはカメラが高画素化した現代社会においてはサーバーとネットワークに余計な負荷をあたえます。  
modern image uploader はローカルにてファイルの縮小処理を行いファイルをアップロードする画像アップローダーのフロントサイドです。
![kenz1925-ss2-9](https://user-images.githubusercontent.com/479696/137863229-ac602000-e61d-4b23-b17a-04b387427bde.png)

サーバー側では通常の画像POSTと同じ用に受け取ることが出来ます。

# modern image uploaderは以下の機能を備えています。

## クライアントサイドで画像を縮小してからのアップロード 
多画素、大容量の画像をクライアントサイドで指定サイズまで縮小してからアップロードします。  
これにより、サーバーに画像をアップロードするときの 最大 nMBのような制限を加えることなくサーバーに負担のかからないアップロード処理を実現します。

## 複数画像のアップロード
画像のアップロード時に画面のリロードは行われません。また、一度に複数のファイルをアップロードすることも出来ます。

##ドラッグアンドドロップでのアップロード
PCではブラウザにファイルをドラッグ・アンド・ドロップすることでファイルをアップロードすることも出来ます。

## アップロードのプレビュー
アップロードしている画像をサムネイル状に表示することが出来ます。

## アップロード状況の確認
アップロード中の画像もサムネイルと並んで表示することが出来ます。
アップロード中は画像にエフェクトがかかることで処理中であることを直感的に伝えます。

## スマートフォン対応
スマートフォンで撮影した写真をそのままアップロードすることが出来ます。  
スマートフォンで行われているexif.Orientationによる画像の回転について画像そのものに対して回転処理をクライアントサイドで行い本来の向きに戻すことが出来ます。

# このファイルは以下のチュートリアルを実践するためのサンプルコードです。

このサンプルコードではチュートリアルに従って古典的なアップローダーから、1つずつ機能を追加していきます。

この画像アップローダーを開発していくチュートリアルは次の記事を見てください
[今風の画像アップローダーを作る](https://firespeed.org/diary.php?diary=kenz-1925)
