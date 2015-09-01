var Handler = {
    getViewPath:function(path){
        var request = URL.parse(VIEWSPATH+path,true);
        var FileName = request.pathname+'.html';

        if(FILE.existsSync(FileName)){
            return FileName;
        }else{
            return null;
        }
    },
    getView:function(path){
        var FileName = this.getViewPath(path);
        if(FileName){
            return FILE.readFileSync(FileName,'utf8');
        }else{
            return null;
        }

    }
}

module.exports=Handler;