const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

class HTMLAssetWithLazySrc extends HTMLAsset {
    collectDependencies() {
        super.collectDependencies();
        this.ast.walk(node => {
            if (node.attrs) {
                for (let attr in node.attrs) {
                    if (attr === 'data-src' || attr === 'data-srcset' || attr === 'data-bgset') {
                        
                        if (attr === 'data-bgset') {
                            const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
                            const separator = ',';
                            const replacementSeparator = '|';
                            
                            const attrVal = node.attrs[attr].replaceAll(replacementSeparator, `_${uniqueId}${separator}`);
                            const srcSetDependencies = super.collectSrcSetDependencies(attrVal);
                            const newAttrVal = srcSetDependencies.replaceAll(`_${uniqueId}${separator}`, `${replacementSeparator} `);
                            node.attrs[attr] = newAttrVal;
                        } else {
                            node.attrs[attr] = super.collectSrcSetDependencies(node.attrs[attr]);
                        }

                        this.isAstDirty = true;
                        continue;
                    }
                }
            }

            return node;
        });
    }
}

module.exports = HTMLAssetWithLazySrc;
