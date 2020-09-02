module.exports = {
    module : {
        rules : [
            {
                // Note:JSファイルはbabel-loaderを通してビルドの意味
                test : /\.js$/,
                exclude : /node_modules/,
                use : {
                    loader : "babel-loader"
                }
            }
        ]
    }
}