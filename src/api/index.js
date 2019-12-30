// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest,
    getRequestWithGame,
    postRequestWithGame,
    postRequestWithJson,
    getRequestWithBlob,
    postRequestWithUpload,
    basePath,
    postReq,
    getRequestMinipro,
    postRequestMinipro,
    deleteRequestMinipro,
    downloadReport
} from '@/libs/axios';

// 文件管理台用户头像接口
export const uploadFile = basePath + "/upload/avater"
// 验证码渲染图片接口
export const drawCodeImage = basePath + "/common/captcha/draw/"
// 获取菜单
export const getMenuList = basePath + "/permission/getMenuList"
// 获取数据字典
export const getDictData = basePath + "/dictData/getByType/"

export const getUploadImgConfig = (params) => {
    return getRequest('/upload/getUploadImgConfig', params)
}

// 上传游戏内图片接口
export const uploadImg = (params) => {
    return postRequestWithUpload('/upload/file', params)
}

// 登陆
export const login = (params) => {
    return postRequest('/login', params)
}
// 获取用户登录信息
export const userInfo = (params) => {
    return getRequest('/user/info', params)
}
// 注册
export const regist = (params) => {
    return postRequest('/user/regist', params)
}
// 初始化验证码
export const initCaptcha = (params) => {
    return getRequest('/common/captcha/init', params)
}
// 个人中心编辑
export const userInfoEdit = (params) => {
    return postRequest('/user/edit', params)
}
// 个人中心修改密码
export const changePass = (params) => {
    return postRequest('/user/modifyPass', params)
}
// 解锁
export const unlock = (params) => {
    return postRequest('/user/unlock', params)
}


// 获取用户数据 多条件
export const getUserListData = (params) => {
    return getRequest('/user/getByCondition', params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
    return getRequest('/user/getAll', params)
}
// 添加用户
export const addUser = (params) => {
    return postRequest('/user/admin/add', params)
}
// 编辑用户
export const editUser = (params) => {
    return postRequest('/user/admin/edit', params)
}
// 启用用户
export const enableUser = (id, params) => {
    return postRequest(`/user/admin/enable/${id}`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
    return postRequest(`/user/admin/disable/${id}`, params)
}
// 删除用户
export const deleteUser = (ids, params) => {
    return deleteRequest(`/user/delByIds/${ids}`, params)
}
// 重置用户密码
export const resetUserPass = (params) => {
    return postRequest('/user/resetPass', params)
}


// 获取全部角色数据
export const getAllRoleList = (params) => {
    return getRequest('/role/getAllList', params)
}
// 分页获取角色数据
export const getRoleList = (params) => {
    return getRequest('/role/getAllByPage', params)
}
// 添加角色
export const addRole = (params) => {
    return postRequest('/role/save', params)
}
// 编辑角色
export const editRole = (params) => {
    return postRequest('/role/edit', params)
}
// 设为或取消注册角色
export const setDefaultRole = (params) => {
    return postRequest('/role/setDefault', params)
}
// 分配角色权限
export const editRolePerm = (params) => {
    return postRequest('/role/editRolePerm', params)
}
// 删除角色
export const deleteRole = (ids, params) => {
    return deleteRequest(`/role/delAllByIds/${ids}`, params)
}


// 获取全部字典
export const getAllDictList = (params) => {
    return getRequest('/dict/getAll', params)
}
// 添加字典
export const addDict = (params) => {
    return postRequest('/dict/add', params)
}
// 编辑字典
export const editDict = (params) => {
    return postRequest('/dict/edit', params)
}
// 删除字典
export const deleteDict = (ids, params) => {
    return deleteRequest(`/dict/delByIds/${ids}`, params)
}
// 搜索字典
export const searchDict = (params) => {
    return getRequest('/dict/search', params)
}
// 获取全部字典数据
export const getAllDictDataList = (params) => {
    return getRequest('/dictData/getByCondition', params)
}
// 添加字典数据
export const addDictData = (params) => {
    return postRequest('/dictData/add', params)
}
// 编辑字典数据
export const editDictData = (params) => {
    return postRequest('/dictData/edit', params)
}
// 删除字典数据
export const deleteData = (ids, params) => {
    return deleteRequest(`/dictData/delByIds/${ids}`, params)
}
// 通过类型获取字典数据
export const getDictDataByType = (type, params) => {
    return getRequest(`/dictData/getByType/${type}`, params)
}


// 获取全部权限数据
export const getAllPermissionList = (params) => {
    return getRequest('/permission/getAllList', params)
}
// 添加权限
export const addPermission = (params) => {
    return postRequest('/permission/add', params)
}
// 编辑权限
export const editPermission = (params) => {
    return postRequest('/permission/edit', params)
}
// 删除权限
export const deletePermission = (ids, params) => {
    return deleteRequest(`/permission/delByIds/${ids}`, params)
}
// 搜索权限
export const searchPermission = (params) => {
    return getRequest('/permission/search', params)
}


// 分页获取日志数据
export const getLogListData = (params) => {
    return getRequest('/log/getAllByPage', params)
}
// 删除日志
export const deleteLog = (ids, params) => {
    return deleteRequest(`/log/delByIds/${ids}`, params)
}
// 清空日志
export const deleteAllLog = (params) => {
    return deleteRequest('/log/delAll', params)
}

// base64上传
export const base64Upload = (params) => {
    return postRequest('/upload/file', params)
}


export const getServerByPage = (params) => {
    return getRequest('/server/getServerByPage', params)
}

export const getListByEnable = (params) => {
    return getRequest('/server/getListByEnable', params)
}

export const addServer = (params) => {
    return postRequest('/server/add', params)
}

export const updateServer = (params) => {
    return postRequest('/server/update', params)
}

export const disableServer = (params) => {
    return postRequest('/server/disable', params)
}

export const enableServer = (params) => {
    return postRequest('/server/enable', params)
}

export const setDefaultServer = (params) => {
    return postRequest('/server/setDefaultServer', params)
}

export const getDefaultServer = (params) => {
    return getRequest('/server/getDefaultServer', params)
}

export const getServerListByParentId = (params) => {
    return getRequest('/server/getServerListByParentId', params)
}

/****** 游戏相关操作 ******/
/****** 游戏相关操作 ******/
/****** 游戏相关操作 ******/

/** 服务器时间相关*/
//获取当前服务器时间
export const getServerTime = () => {
    return getRequestWithGame('/now')
}
//更新服务器时间
export const updateServerTime = (params) => {
    return postRequestWithGame('/changetime', params)
}

/** 公告相关*/
//分页获取公告数据
export const getNoticeListData = (params) => {
    return getRequestWithGame('/getNotices', params)
}
//添加公告
export const addNotice = (params) => {
    return postRequestWithJson('/addNotice', params)
}
//删除公告
export const deleteNotice = (params) => {
    return getRequestWithGame('/deleteNotice', params)
}
//修改公告
export const editNotice = (params) => {
    return postRequestWithJson('/editNotice', params)
}

/** 邮件*/
export const sendMail = (params) => {
    return postRequestWithJson('/sendMail', params)
}

/** 招募*/
export const randomGoldStaff = (params) => {
    return getRequestWithGame('/randomGoldStaff', params)
}

export const randomDiamondStaff = (params) => {
    return getRequestWithGame('/randomStaff', params)
}

/** 游戏反馈*/
export const delFeedbackById = (params) => {
    return getRequestWithGame('/delFeedbackById', params)
}

//导出excel
export const getFeedbackEx = (params) => {
    return getRequestWithBlob('/getFeedbackEx', params)
}

//分页获取
export const getFeedback = (params) => {
    return postRequestWithJson('/getFeedback', params)
}
//删除参数时间前的反馈
export const delFeedbackBytime = (params) => {
    return getRequestWithGame('/delFeedbackBytime', params)
}

/** cdkey相关*/
export const getOperation = (params) => {
    return getRequestWithGame('/getOperation', params)
}

export const getItemList = (params) => {
    return getRequestWithGame('/getItemList', params)
}

export const addcdkey = (params) => {
    return postRequestWithJson('/addcdkey', params)
}

export const deleteCDkey = (params) => {
    return getRequestWithGame('/deleteCDkey', params)
}

export const getCDkeys = (params) => {
    return getRequestWithGame('/getCDkeys', params)
}

export const getUseUsers = (params) => {
    return getRequestWithGame('/getUseUsers', params)
}

export const exportExcel = (params) => {
    return getRequestWithBlob('/exportExcel', params)
}

/** 游戏用户相关操作*/
export const updateUser = (params) => {
    return postRequestWithJson('/updateUser', params)
}

export const getAllUsers = (params) => {
    return getRequestWithGame('/getAllUsers', params)
}

export const getBags = (params) => {
    return getRequestWithGame('/getBags', params)
}

export const searchUser = (params) => {
    return getRequestWithGame('/searchUser', params)
}

export const recharge = (params) => {
    return getRequestWithGame('/recharge', params)
}

export const queryStock = (params) => {
    return getRequestWithGame('/queryStock', params)
}

export const updateStock = (params) => {
    return postRequestWithJson('/updateStock', params)
}
export const openVip = (params) => {
    return getRequestWithGame('/vip', params)
}

/** 员工信息*/
export const getStaffPostInfo = (params) => {
    return getRequestWithGame('/getStaffPostInfo', params)
}

export const getAllStaffInfo = (params) => {
    return getRequestWithGame('/getAllStaffInfo', params)
}

export const getStaffInfo = (params) => {
    return getRequestWithGame('/getStaffInfo', params)
}

/** 停服 */
export const getStopServerInfo = (params) => {
    return getRequestWithGame('/getStopServerInfo', params)
}

export const updateStopServerNotice = (params) => {
    return postRequestWithJson('/updateStopServerNotice', params)
}

export const changeServerState = (params) => {
    return postRequestWithGame('/changeServerState', params)
}

/** json上传接口 */
export const uploadJson = (params) => {
    return postRequestWithUpload('/uploadJson', params)
}

export const getServerList = (params) => {
    return getRequestWithGame('/getServerList', params)
}

export const updateServerList = (params) => {
    return postRequestWithJson('/updateServerList', params)
}


export const loadRemoteConfigs = (params) => {
    return getRequestWithGame('/loadRemoteConfigs', params)
}

export const getJsonByName = (params) => {
    return getRequestWithGame('/getJsonByName', params)
}


/** 店铺信息 */
export const getMarkets = (params) => {
    return getRequestWithGame('/getMarkets', params)
}

export const showActs = () => {
    return getRequestWithGame('/showActs')
}

export const changeAct = (params) => {
    return postRequestWithGame('/changeAct', params)
}
export const skipNewGuide = (params) => {
    return getRequestWithGame('/wechat/skipNewGuide', params)
}

/**
 * 渠道管理---------------------------------------------------------------------
 */
export const queryAllCreativeReq = (params) => {
    return getRequest('/game/queryAllCreative', params)
}
export const addCreative = (params) => {
    return postRequest('/game/addCreative', params)
}
export const editCreative = (params) => {
    return postRequest('/game/updateCreative', params)
}
export const deleteCreative = (ids, params) => {
    return deleteRequest(`/game/delCreativeByIds/${ids}`, params)
}
/**
 *
 * 广告管理----------------------------------------------------------------------
 */
export const queryAllAdvertReq = (params) => {
    return getRequest('/game/queryAllAdvert', params)
}
export const addAdvert = (params) => {
    return postRequest('/game/addAdvert', params)
}
export const editAdvert = (params) => {
    return postRequest('/game/updateAdvert', params)
}
export const deleteAdvert = (ids, params) => {
    return deleteRequest(`/game/delAdvertByIds/${ids}`, params)
}
/**
 *
 * 分服管理----------------------------------------------------------------------
 */
export const queryAllClientReq = (params) => {
    return getRequest('/game/queryAllServer', params)
}
export const addClient = (params) => {
    return postRequest('/game/addServer', params)
}
export const editClient = (params) => {
    return postRequest('/game/updateServer', params)
}
export const deleteClient = (ids, params) => {
    return deleteRequest(`/game/delServerByIds/${ids}`, params)
}
/**
 * 小程序管理-----------------------------------------------------------------
 */
export const queryAllUser = (params) => {
    return postRequestMinipro('/report/api/user/findAllUser', params)
}
/**
 * 日报下载---------------------------------------------------------------------
 */
export const downloadReportReq = (url) => {
    return downloadReport(url)
}
