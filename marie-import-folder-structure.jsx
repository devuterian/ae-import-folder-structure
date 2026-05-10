/**
 * Import Folder Structure — After Effects ExtendScript (ES3)
 *
 * 사용법: AE 메뉴 File > Scripts > Run Script File… 에서 이 파일 실행
 * 또는 Scripts 폴더에 두고 File > Scripts 에서 선택
 *
 * 동작: 폴더 선택 대화상자에서 디스크 폴더를 고르면,
 *       프로젝트 패널에 같은 이름의 최상위 폴더를 만들고
 *       그 안에 하위 폴더·파일 구조를 그대로 재현하며 푸티지를 가져옵니다.
 *
 * 참고: 이미지 시퀀스는 폴더 단위 자동 병합이 UI 가져오기만큼 정교하지 않습니다.
 *       시퀀스가 깨지면 해당 폴더에서 첫 프레임만 지정해 시퀀스로 다시 가져오세요.
 *
 * 한글 등 비ASCII 이름: macOS에서 File/Folder.name 이 퍼센트 인코딩으로만
 * 나오는 경우가 있어 fsName 기준 basename + 필요 시 decodeURIComponent 로 표시명을 복원합니다.
 */

(function () {
  /**
   * 프로젝트 패널에 쓸 디스크 항목의 표시 이름 (Unicode).
   * .name 만 쓰면 "0.%20%E1%84%86..." 처럼 깨질 수 있음.
   */
  function getUnicodeEntryName(entry) {
    var raw = "";
    var fs = "";
    var i;
    var c;
    try {
      fs = entry.fsName;
    } catch (e0) {
      fs = "";
    }
    if (fs && fs.length > 0) {
      var p = fs;
      while (
        p.length > 0 &&
        ((c = p.charAt(p.length - 1)) === "/" || c === "\\")
      ) {
        p = p.substring(0, p.length - 1);
      }
      var last = -1;
      for (i = p.length - 1; i >= 0; i--) {
        c = p.charAt(i);
        if (c === "/" || c === "\\") {
          last = i;
          break;
        }
      }
      raw = last >= 0 ? p.substring(last + 1) : p;
    }
    if (!raw || raw.length === 0) {
      try {
        raw = entry.name;
      } catch (e1) {
        raw = "";
      }
    }
    if (raw.indexOf("%") !== -1) {
      try {
        raw = decodeURIComponent(raw);
      } catch (e2) {
        // 그대로 사용
      }
    }
    return raw;
  }

  function bubbleSortFiles(arr) {
    var i, j, tmp;
    var li, lj;
    for (i = 0; i < arr.length - 1; i++) {
      for (j = i + 1; j < arr.length; j++) {
        li = getUnicodeEntryName(arr[i]);
        lj = getUnicodeEntryName(arr[j]);
        if (li > lj) {
          tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
      }
    }
  }

  function shouldSkipName(name) {
    if (!name || name.length === 0) return true;
    if (name.charAt(0) === ".") return true;
    if (name === "Thumbs.db") return true;
    return false;
  }

  function isFolderEntry(entry) {
    return entry instanceof Folder;
  }

  function moveImportResultIntoFolder(importResult, destFolder) {
    if (!importResult || !destFolder) return;
    var i;
    if (importResult instanceof Array) {
      for (i = 0; i < importResult.length; i++) {
        importResult[i].parentFolder = destFolder;
      }
      return;
    }
    importResult.parentFolder = destFolder;
  }

  function importDiskFile(file, destFolder) {
    if (!file.exists) return false;
    try {
      var io = new ImportOptions(file);
      var result = app.project.importFile(io);
      moveImportResultIntoFolder(result, destFolder);
      return true;
    } catch (e) {
      return false;
    }
  }

  function importDiskTree(diskFolder, projectFolder, stats) {
    var list = diskFolder.getFiles();
    if (!list) return;

    var entries = [];
    var i;
    for (i = 0; i < list.length; i++) {
      entries.push(list[i]);
    }
    bubbleSortFiles(entries);

    for (i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var label = getUnicodeEntryName(entry);
      if (shouldSkipName(label)) continue;

      if (isFolderEntry(entry)) {
        var subProj = projectFolder.items.addFolder(label);
        importDiskTree(entry, subProj, stats);
      } else if (entry instanceof File) {
        if (importDiskFile(entry, projectFolder)) {
          stats.imported++;
        } else {
          stats.skipped++;
        }
      }
    }
  }

  var rootDisk = Folder.selectDialog("프로젝트로 가져올 폴더를 선택하세요");
  if (!rootDisk) return;

  app.beginUndoGroup("폴더 구조 가져오기");

  var stats = { imported: 0, skipped: 0 };

  try {
    var rootLabel = getUnicodeEntryName(rootDisk);
    var rootProj = app.project.items.addFolder(rootLabel);
    importDiskTree(rootDisk, rootProj, stats);

    alert(
      "가져오기 완료\n\n" +
        "성공: " +
        stats.imported +
        "개 파일\n" +
        (stats.skipped > 0
          ? "건너뜀(미지원·오류): " + stats.skipped + "개\n"
          : "") +
        "\n프로젝트 폴더: \"" +
        rootLabel +
        "\""
    );
  } catch (err) {
    alert("오류: " + err.toString());
  } finally {
    app.endUndoGroup();
  }
})();
