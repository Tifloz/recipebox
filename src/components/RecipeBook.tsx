import * as React from 'react';
import { connect } from 'react-redux';

import { IRecipe } from '../_domain/IRecipe';
import { IStoreState } from '../_domain/IStoreState';
import {
  setIndexVisibilityAction,
  setSelectedRecipeAction
} from '../actions/recipe-actions';
import { getSelectedRecipe } from '../recipe-reducer';
import IndexPage from './IndexPage';
import Recipe from './recipe';
import RecipeForm from './RecipeForm';
import Ribbon from './ribbon';

interface IRecipebookState {
  recipes: IRecipe[];
  selectedRecipe: IRecipe;
}

interface IRecipeBookProps {
  setSelectedRecipe: any;
  state: IStoreState;
  toggle: any;
}

const mapStateToProps = (state: IStoreState) => {
  return {
    state
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setSelectedRecipe: (recipeName: string) => dispatch(setSelectedRecipeAction(recipeName)),
    toggle: (isVisible: boolean) => dispatch(setIndexVisibilityAction(isVisible))
  };
}

let initialToggle = true;

export default class RecipeBookComponent extends React.Component<IRecipeBookProps, IRecipebookState> {
  constructor(props: IRecipeBookProps) {
    super(props);
    this.setRecipeName = this.setRecipeName.bind(this);
  }

  public handleClick = () => {
    this.props.toggle(!initialToggle);
    initialToggle = !initialToggle;
    console.log("component state", this.props);
  }

  public setRecipeName = (recipeName: string) => {
    this.props.setSelectedRecipe(recipeName);
  }

  public render(): JSX.Element {
    // {this.state.mode === Mode.index && <IndexPage recipes={this.state.recipes} mode={this.state.mode} />}

    const selectedRecipe = getSelectedRecipe(this.props.state);
    const isEditMode = getEditMode(this.props.state);
    let recipeElement;
    if (!isEditMode) {
      recipeElement = selectedRecipe &&
        <Recipe
          key={selectedRecipe.name}
          recipe={selectedRecipe}
          deleteCallback={this.deleteRecipe}
          editModeCallback={this.editRecipe}
        />;
    } else {
      recipeElement = <RecipeForm recipe={selectedRecipe} cancelCallback={this.cancelEditMode} />;
    }

    const ribbonElement = (!isEditMode) && <Ribbon indexCallback={this.showIndex} />;

    const recipeContainerClass = getIndexVisibility(this.props.state)
      ? "recipe-container" : "recipe-container visible";

    return (
      <div>
        <button className="testButton" onClick={this.handleClick}>Test</button>
        <div className='recipebook'>
          <IndexPage className='page' recipes={this.props.state.recipes} createRecipe={this.createRecipe} setSelectedRecipe={this.setRecipeName} />
            {ribbonElement}
          {recipeElement}
        </div>
      </div>
    );
  }
}

export const RecipeBook = connect(mapStateToProps, mapDispatchToProps)(RecipeBookComponent)
