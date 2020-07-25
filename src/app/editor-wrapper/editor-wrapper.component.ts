import { Component, OnInit, AfterViewInit, OnDestroy ,ViewChild, ElementRef } from '@angular/core';
import { fromEventPattern, defer, Subscription} from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../shared/authentication.service';
import KatexExtension from './katex-editor-extension';

declare const MediumEditor: any;

@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.css']
})
export class EditorWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  editor: {
    subscribe: (event: string, listener: (_: any, data: { innerHTML: string }) => void)  => void,
    unsubscribe: (event: string, listener: () => void) => void,
    destroy: () => void,
  };
  editorReady = false;
  subscription: Subscription;

  constructor(
    private anuglarFireStore: AngularFirestore,
    public authenticationService: AuthenticationService,
  ) {
  }

  @ViewChild('editable', {
    static: true
  }) editable: ElementRef;
  ngAfterViewInit(): void {
    this.editor = new MediumEditor(this.editable.nativeElement, {
      paste: {
        /* This example includes the default options for paste,
        if nothing is passed this is what it used */
        forcePlainText: false,
        cleanPastedHTML: true,
        cleanReplacements: [],
        cleanAttrs: ['class', 'style', 'dir', 'name'],
        cleanTags: ['meta'],
        unwrapTags: []
      },
      extensions: {
        'katex': new (KatexExtension as any)(),
      },
      toolbar: {
        /* These are the default options for the toolbar,
        if nothing is passed this is what is used */
        allowMultiParagraphSelection: true,
        buttons: BUTTONS,
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
        /* options which only apply when static is true */
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false
      }
    });
    this.subscribeSyncToFirestore()
  }

  private async subscribeSyncToFirestore() {
    const doc = await defer(async () => {
      const user = await this.authenticationService.userData.pipe(first()).toPromise();
      return this.anuglarFireStore.collection('editors').doc<{ content: string }>(user.uid);
    }).toPromise();
    const snapshot = await doc.get().toPromise();
    if (snapshot.exists) {
      this.editable.nativeElement.innerHTML = snapshot.data().content;
    } else {
      this.editable.nativeElement.innerHTML = '';
      doc.set({ content: '' });
    }


    this.subscription = fromEventPattern(
      (handler) => { this.editor.subscribe('editableInput', handler); },
      (handler) => { this.editor.unsubscribe('editableInput', handler); },
      (_, { innerHTML }: { innerHTML: string }) => innerHTML,
    )
      .pipe(debounceTime(1000))
      .subscribe((content: string) => {
        doc.update({ content });
      });

    this.editorReady = true;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.editor.destroy();
  }
}

const BUTTONS = [
  'bold'
  , 'italic'
  , 'underline'

  , 'subscript'
  , 'superscript'
  , 'anchor'
  , 'quote'
  , 'pre'
  , 'orderedlist'
  , 'unorderedlist'
  , 'indent'
  , 'justifyLeft'
  , 'justifyCenter'
  , 'justifyRight'
  , 'justifyFull'
  , 'h1'
  , 'h2'
  , 'h3'
  , 'h4'
  , 'h5'
  , 'h6'

]
