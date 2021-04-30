# Sample Client

An empty project acting as a template to build MoDeL-based applications.

## Setup
In external projects the local dependency to MoDeL project should be changed to git.

``` diff
package.json
...
- "@3mo/model": "file:../.."
+ "@3mo/model": "git+https://github.com/3mo-esolutions/model.git"
...
```