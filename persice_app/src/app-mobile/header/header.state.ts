import { Injectable } from '@angular/core';

// List of possible actions when clicking on buttons in header
export enum HeaderActions {
  FiltersOpen,
  FiltersGo,
  NewConversation,
  EditMyProfile,
  MyProfile,
  Conversations,
  EditPhotos,
  ChooseAlbum,
  ChoosePhoto,
  SaveCroppedPhoto,
  EditPersonalInfo,
  ShowUserProfile,
  BackToListView,
  Back,
  SendMessage,
  None
}

// State for keeping record which button is visible on the left side of header
export enum LeftHeaderState {
  Menu,
  Back,
  Cancel,
  CancelSmall
}

// State for keeping record which button is visible on the right side of header

export enum RightHeaderState {
  Add,
  Send,
  Search,
  Go,
  Edit,
  Done,
  None,
  ConnectionMenu,
  EventMenu
}

// State for keeping record what content is visible in the center section of header
export enum CenterHeaderState {
  Title,
  FiltersTabs,
  GalleryPagination,
  ConversationsTitleWithCounter,
  None
}

@Injectable()
export class HeaderState {

  public static actions = HeaderActions;
  public static left = LeftHeaderState;
  public static right = RightHeaderState;
  public static center = CenterHeaderState;

  public static initial = {
    left: HeaderState.left.Menu,
    leftAction: HeaderState.actions.None,
    center: HeaderState.center.Title,
    right: HeaderState.right.None,
    rightAction: HeaderState.actions.None,
    transparent: false,
    title: 'Persice'
  };

  public static photoGallery = {
    left: HeaderState.left.Back,
    leftAction: HeaderState.actions.ShowUserProfile,
    center: HeaderState.center.GalleryPagination,
    right: HeaderState.right.None,
    rightAction: HeaderState.actions.None,
    transparent: false,
    title: ''
  };

  public static crowdProfile = {
    left: HeaderState.left.Back,
    leftAction: HeaderState.actions.BackToListView,
    center: HeaderState.center.None,
    right: HeaderState.right.None,
    rightAction: HeaderState.actions.None,
    transparent: true,
    title: ''
  };

  public static connectionProfile = {
    left: HeaderState.left.Back,
    leftAction: HeaderState.actions.BackToListView,
    center: HeaderState.center.None,
    right: HeaderState.right.ConnectionMenu,
    rightAction: HeaderState.actions.None,
    transparent: true,
    title: ''
  };

  public static userProfile = {
    left: HeaderState.left.Back,
    leftAction: HeaderState.actions.Back,
    center: HeaderState.center.None,
    right: HeaderState.right.None,
    rightAction: HeaderState.actions.None,
    transparent: true,
    title: ''
  };

  public static userProfileWithMenu = {
    left: HeaderState.left.Back,
    leftAction: HeaderState.actions.Back,
    center: HeaderState.center.None,
    right: HeaderState.right.ConnectionMenu,
    rightAction: HeaderState.actions.None,
    transparent: true,
    title: ''
  };


  public static crowd = {
    left: LeftHeaderState.Menu,
    center: CenterHeaderState.Title,
    right: RightHeaderState.Search,
    rightAction: HeaderActions.FiltersOpen,
    transparent: false,
    title: 'Crowd'
  };

  public static connections = {
    left: LeftHeaderState.Menu,
    center: CenterHeaderState.Title,
    right: RightHeaderState.Search,
    rightAction: HeaderActions.FiltersOpen,
    transparent: false,
    title: 'Pals'
  };

  public static messages = {
    left: LeftHeaderState.Menu,
    center: CenterHeaderState.ConversationsTitleWithCounter,
    right: RightHeaderState.Add,
    rightAction: HeaderActions.NewConversation,
    transparent: false,
    title: 'Conversations'
  };

  public static newConversation = {
    left: LeftHeaderState.CancelSmall,
    leftAction: HeaderActions.Conversations,
    center: CenterHeaderState.Title,
    right: RightHeaderState.Send,
    rightAction: HeaderActions.SendMessage,
    transparent: false,
    title: 'New Message'
  };

  public static editMyProfile = {
    left: LeftHeaderState.Back,
    leftAction: HeaderActions.MyProfile,
    center: CenterHeaderState.Title,
    right: RightHeaderState.None,
    transparent: false,
    title: 'Edit'
  };

  public static myProfile = {
    left: LeftHeaderState.Menu,
    center: CenterHeaderState.None,
    right: RightHeaderState.Edit,
    rightAction: HeaderActions.EditMyProfile,
    transparent: true,
    title: ''
  };

  public static attendees = {
    left: LeftHeaderState.Back,
    leftAction: HeaderState.actions.Back,
    center: CenterHeaderState.Title,
    right: RightHeaderState.None,
    transparent: false,
    title: 'Attendees'
  };

  public static event = {
    left: LeftHeaderState.Back,
    leftAction: HeaderState.actions.Back,
    center: CenterHeaderState.None,
    right: RightHeaderState.EventMenu,
    rigthAction: HeaderState.actions.None,
    transparent: true,
    title: ''
  };

  public static eventNotFound = {
    left: LeftHeaderState.Back,
    leftAction: HeaderState.actions.Back,
    center: CenterHeaderState.Title,
    right: RightHeaderState.EventMenu,
    rigthAction: HeaderState.actions.None,
    transparent: false,
    title: 'Persice'
  };

  public static onlyMenu = {
    left: LeftHeaderState.Menu,
    center: CenterHeaderState.None,
    right: RightHeaderState.None,
    transparent: false,
    title: ''
  };

  public backDoneWithTitle(pageTitle: string, action: any) {
    return {
      left: LeftHeaderState.Back,
      leftAction: action,
      center: CenterHeaderState.Title,
      right: RightHeaderState.Done,
      rightAction: action,
      transparent: false,
      title: pageTitle
    };
  }

  public backDoneWithTitleAndActions(pageTitle: string, actionLeft: any, actionRight: any) {
    return {
      left: LeftHeaderState.Back,
      leftAction: actionLeft,
      center: CenterHeaderState.Title,
      right: RightHeaderState.Done,
      rightAction: actionRight,
      transparent: false,
      title: pageTitle
    };
  }

  public backWithTitle(pageTitle: string, action: any) {
    return {
      left: LeftHeaderState.Back,
      leftAction: action,
      center: CenterHeaderState.Title,
      right: RightHeaderState.None,
      rightAction: HeaderActions.None,
      transparent: false,
      title: pageTitle
    };
  }

}
