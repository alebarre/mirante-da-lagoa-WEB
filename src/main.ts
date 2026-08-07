import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule, {})
  .catch(() => console.error('Falha ao inicializar a aplicação.'));
