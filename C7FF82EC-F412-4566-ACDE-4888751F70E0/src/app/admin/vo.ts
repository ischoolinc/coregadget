/**目前模式 */
export class mode {
    mode :'view' |'edit' |'add' ='view' ;
    isViewMode()
    {
        return this.mode == 'view'
    }
    isEditMode(){
        return this.mode == 'edit'
    }
    isAddMode(){
        return this.mode == 'add'
    }
}