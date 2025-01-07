import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  constructor(  private empresaService: EmpresaService,
                private fb: FormBuilder,
                private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {

    this.loadEmpresa();

  }

  /** ================================================================
   *  LOAD EMPRESA
  ==================================================================== */
  public empresa!: Empresa;
  public header = {
    background: '#ffffff',
    color: '#2d2d2d'
  }

  public footer = {
    background: '#2d2d2d',
    color: '#ffffff'
  }

  loadEmpresa(){

    this.empresaService.loadEmpresa()
        .subscribe( ({empresa}) => {

          this.empresa = empresa;

          if (empresa.header) {
            this.header = empresa.header;
          }

          if (empresa.footer) {
            this.footer = empresa.footer;
          }

          this.formUpdate.setValue({
            name: empresa.name || '',
            address: empresa.address || '',
            nit: empresa.nit || '',
            email: empresa.email || '',
            codephone: empresa.codephone || '',
            phone: empresa.phone || '',
            facebook: empresa.facebook || '',
            instagram: empresa.instagram || '',
            tiktok: empresa.tiktok || '',
            whatsapp: empresa.whatsapp || '',
            descripcion: empresa.descripcion || '',
            keywords: empresa.keywords || ''
          })
          
        }, (err) => {
          console.log(err);
          Swal.fire('error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   * UPDATE EMPRESA
  ==================================================================== */
  public formSubmmited: boolean = false;
  public formUpdate = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    address: ['', [Validators.required]],
    nit: ['', [Validators.required]],
    codephone: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    facebook: '',
    instagram: '',
    tiktok: '',
    whatsapp: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    keywords: ['', [Validators.required]]
  })

  update(){

    this.formSubmmited = true;
    
    if (this.formUpdate.invalid) {
      this.formSubmmited = false;
      return
    }

    this.empresaService.updateEmpresa(this.formUpdate.value, this.empresa.eid!)
        .subscribe( ({empresa}) => {

          this.formSubmmited = false;
          Swal.fire('Estupendo', 'Se ha actualizado la información exitosamente!', 'success');
          this.loadEmpresa();
          
          
        }, (err) => {
          console.log(err);
          this.formSubmmited = false;
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }


  validateEditForm(campo: string): boolean{

    if (this.formSubmmited && this.formUpdate.get(campo)?.invalid) {
      return true;
    }else{
      return false;
    }

  }

  /** ================================================================
   *  CHANGE HEADER
  ==================================================================== */
  changeHeader(background: string, color: string){
   
    this.header.background = background;
    this.header.color = color;

    this.empresaService.updateEmpresa({header: this.header}, this.empresa.eid!)
        .subscribe( ({empresa}) => {
          this.empresaService.empresa.header = this.header;
          Swal.fire('Estupendo', 'Se ha actualizado exitosamente el header!', 'success');
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  CHANGE COLORS
  ==================================================================== */
  changeFooter(background: string, color: string){

    this.footer.background = background;
    this.footer.color = color;

    this.empresaService.updateEmpresa({footer: this.footer}, this.empresa.eid!)
        .subscribe( ({empresa}) => {
          this.empresaService.empresa.footer = this.footer;
          Swal.fire('Estupendo', 'Se ha actualizado exitosamente el footer!', 'success');
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }


  /** ================================================================
   *   ACTUALIZAR IMAGEN
  ==================================================================== */
  public imgTempP: any = null;
  public subirImagen!: any;
  cambiarImage(file: any): any{  
    
    this.subirImagen = file.target.files[0];
    
    if (!this.subirImagen) { return this.imgTempP = null }    
    
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file.target.files[0]);
        
    reader.onloadend = () => {
      this.imgTempP = reader.result;      
    }

  }

  /** ================================================================
   *  SUBIR IMAGEN
  ==================================================================== */
  @ViewChild('fileImg') fileImg!: ElementRef;
  public imgPerfil: string = 'no-image';
  subirImg(desc: string | 'logo' | 'logob' | 'ico' |'imgBef' | 'imgAft' | 'video' | 'none'){

    if (desc === 'none') {
      Swal.fire('Atención', 'debes de seleccionar el tipo de imagen', 'warning');
      return;
    }
    
    this.fileUploadService.updateImage( this.subirImagen, 'logo', this.empresa.eid!, desc)
    .then( 
      (resp:{ date: Date, nombreArchivo: string, ok: boolean }) => {
        
        this.loadEmpresa();
      }
    );
    
    this.fileImg.nativeElement.value = '';
    this.imgTempP = null;
    
  }

}
