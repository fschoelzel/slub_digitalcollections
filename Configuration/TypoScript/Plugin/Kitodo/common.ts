# --------------------------------------------------------------------------------------------------------------------
# kitodo page config
# header style an js files
# --------------------------------------------------------------------------------------------------------------------


page {
  includeCSS {
        kitodo = {$config.kitodo.css.lists}
        kitodo.media = screen,projection
    }
    # we need jquery in head as it is used by pageview plugin
    # --> jQuery must be provided by Kitodo.Presentation --> include Template "Basis Configuration"
    includeJSFooterlibs {
        kitodo-frontend          = EXT:slub_digitalcollections/Resources/Public/Javascript/DigitalcollectionsListScripts.js
    }
}

[globalVar = TSFE:page|backend_layout = pagets__kitodo]||[globalVar = TSFE:page|backend_layout = pagets__emptyworkview]
    config.disableWrapInBaseClass = 1

    # switch to viewer css
    page.includeCSS.kitodo = {$config.kitodo.css.page}

    # switch to viewer js
    page.includeJSFooterlibs.kitodo = EXT:slub_digitalcollections/Resources/Public/Javascript/DigitalcollectionsScripts.js

    # clear not required js
    page.includeJSFooterlibs.kitodo-frontend >

[global]

# --------------------------------------------------------------------------------------------------------------------
# add opengraph social metatags in single view with a valid id
# --------------------------------------------------------------------------------------------------------------------
[globalVar = GP:tx_dlf|id > 0]

  page.2 = LOAD_REGISTER
  page.2 {

    pageUrlDigital {
      cObject = TEXT
      cObject {
        dataWrap = DB:tx_dlf_documents:{GP:tx_dlf|id}:purl
        wrap3={|}
        insertData=1
      }
    }

    # sometimes partOf is set...
    partOf {
      cObject = TEXT
      cObject {
        dataWrap = DB:tx_dlf_documents:{GP:tx_dlf|id}:partof
        wrap3={|}
        insertData=1
      }
    }

    postDescription {
      cObject = COA
      cObject {
        10 = CONTENT
        10 {
          table = tx_dlf_documents
          select {
            pidInList = 4152
            selectFields=title,author,year,place
            where=uid=###postid###
            markers {
              #postid.data = GP:tx_dlf|id
              postid.data = register:partOf
            }
          }

          renderObj=COA
          renderObj {
            10 = TEXT
            10 {
              field = author
              stdWrap.if.isTrue.field = author
              stdWrap.noTrimWrap = ||: |
            }
            20 = TEXT
            20 {
              field = title
              stdWrap.if.isTrue.field = title
              stdWrap.noTrimWrap = ||, |
            }
            30 = TEXT
            30 {pagets__
              field = place
              stdWrap.if.isTrue.field = place
            }
            40 = TEXT
            40 {
              field = year
              stdWrap.if.isTrue.field = year
              stdWrap.noTrimWrap = |, ||
            }
          }
        }

        20 = CONTENT
        20 {

          table = tx_dlf_documents
          select {
            pidInList = 4152
            selectFields=title,author,year,place
            where=uid=###postid###
            markers {
              # would work, but we want the year too...
              #postid.data = register:partOf // GP:tx_dlf|id
              postid.data = GP:tx_dlf|id
            }
          }

          renderObj=COA
          renderObj {
            10 = TEXT
            10 {
              field = author
              stdWrap.if.isTrue.field = author
              stdWrap.noTrimWrap = ||: |
            }
            20 = TEXT
            20 {
              field = title
              stdWrap.if.isTrue.field = title
              stdWrap.noTrimWrap = ||, |
            }
            30 = TEXT
            30 {
              field = place
              stdWrap.if.isTrue.field = place
            }
            40 = TEXT
            40 {
              field = year
              stdWrap.if.isTrue.field = year
              stdWrap.noTrimWrap = | | |
            }
          }
        }
      }
    }

    postTitle {
      cObject = COA
      cObject {
        10 = TEXT
        10 {
          dataWrap = DB:tx_dlf_documents:{GP:tx_dlf|id}:title
          wrap3 = {|}
          insertData = 1
          if {
            value = 1
            isEmpty.data = register:partOf
          }
        }

        20 = TEXT
        20 {
          dataWrap = DB:tx_dlf_documents:{register:partOf}:title
          wrap3={|}
          insertData = 1
          if {
            value = 1
            isTrue.data = register:partOf
          }
        }
      }
    }

  }


  # overwrite page title:
  config.noPageTitle = 2
  page.headerData.10 >
  page.headerData.10 = TEXT
  page.headerData.10 {
    wrap = <title> | </title>
    value = {register:postTitle} - {$config.kitodo.rootPage.title}
    insertData = 1
    htmlSpecialChars = 1
  }

  # overwrite page.meta.description with blog teaser
  page.meta.description.data = register:postDescription

  page.headerData.300 = COA
  page.headerData.300 {
    10 = TEXT
    10.value (

  <meta property="og:title" content="{register:postTitle}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{register:pageUrlDigital}" />

    )
    10.insertData = 1

    11 = TEXT
    11 {
      data = register:postDescription
      wrap = <meta property="og:description" content="|" />
      required = {register:postDescription}
      trim = 1
      htmlSpecialChars = 1
      htmlSpecialChars.preserveEntities = 1
    }

  }

[global]
